import GitHubProvider from "next-auth/providers/github"
import dbConnect from "./db/mongodb"
import User from "./models/User"

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          await dbConnect()
          
          // Check if user already exists by email or GitHub ID
          let existingUser = await User.findOne({ 
            $or: [
              { email: user.email },
              { githubId: profile.id.toString() }
            ]
          })

          if (existingUser) {
            // Update GitHub ID if not set (account linking)
            if (!existingUser.githubId) {
              existingUser.githubId = profile.id.toString()
              existingUser.isGithubUser = true
              await existingUser.save()
            }
          } else {
            // Create new user with unique username
            let username = profile.login || user.name?.replace(/\s+/g, '').toLowerCase() || user.email.split('@')[0]
            
            // Ensure username uniqueness
            let counter = 1
            let originalUsername = username
            while (await User.findOne({ username })) {
              username = `${originalUsername}${counter}`
              counter++
            }
            
            existingUser = new User({
              username,
              email: user.email,
              githubId: profile.id.toString(),
              avatar: user.image,
              isGithubUser: true
            })
            await existingUser.save()
          }
          
          return true
        } catch (error) {
          console.error("Error during GitHub sign in:", error)
          return true // Allow sign in even if DB fails
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to /notes after successful GitHub login
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/notes`
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return `${baseUrl}/notes`
    },
    async session({ session, token }) {
      if (token.sub) {
        try {
          await dbConnect()
          const user = await User.findOne({ 
            $or: [
              { email: session.user.email },
              { githubId: token.sub }
            ]
          })
          
          if (user) {
            session.user.id = user._id.toString()
            session.user.username = user.username
            session.user.isGithubUser = user.isGithubUser
          }
        } catch (error) {
          console.error("Error fetching user in session:", error)
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubId = profile.id
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}