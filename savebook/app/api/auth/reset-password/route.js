
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/db/mongodb.js";
// import User from "@/lib/models/User.js";

// export async function POST(req) {
//   await dbConnect();

//   const { token, password, recoveryCode } = await req.json();

//   if (!token || !password || !recoveryCode) {
//     return NextResponse.json(
//       { message: "Token, password and recovery code are required" },
//       { status: 400 }
//     );
//   }

//   const user = await User.findOne({
//     resetPasswordToken: token,
//     resetPasswordExpiry: { $gt: Date.now() },
//   }).select("+password +recoveryCodes");

//   if (!user) {
//     return NextResponse.json(
//       { message: "Invalid or expired reset token" },
//       { status: 400 }
//     );
//   }

//   // ✅ bcrypt compare instead of sha256
//   let matchedIndex = -1;

//   for (let i = 0; i < user.recoveryCodes.length; i++) {
//     const rc = user.recoveryCodes[i];

//     if (!rc.used) {
//       const isMatch = await bcrypt.compare(recoveryCode, rc.code);
//       if (isMatch) {
//         matchedIndex = i;
//         break;
//       }
//     }
//   }

//   if (matchedIndex === -1) {
//     return NextResponse.json(
//       { message: "Invalid or already used recovery code" },
//       { status: 400 }
//     );
//   }

//   // ✅ mark matched recovery code as used
//   user.recoveryCodes[matchedIndex].used = true;

//   // ✅ update password (pre-save hook will hash)
//   user.password = password;

//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpiry = undefined;

//   await user.save();

//   return NextResponse.json({
//     message: "Password reset successful. Please login.",
//   });
// }

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongodb.js";
import User from "@/lib/models/User.js";

export async function POST(req) {
  await dbConnect();

  const { username, password, recoveryCode } = await req.json();

  // 1️⃣ Validate input
  if (!username || !password || !recoveryCode) {
    return NextResponse.json(
      { message: "Username, password and recovery code are required" },
      { status: 400 }
    );
  }

  // 2️⃣ Find user by username
  const user = await User.findOne({ username }).select(
    "+password +recoveryCodes"
  );

  if (!user) {
    // generic message (security)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  // 3️⃣ Verify recovery code (bcrypt compare)
  let matchedIndex = -1;

  for (let i = 0; i < user.recoveryCodes.length; i++) {
    const rc = user.recoveryCodes[i];

    if (!rc.used) {
      const isMatch = await bcrypt.compare(recoveryCode, rc.code);
      if (isMatch) {
        matchedIndex = i;
        break;
      }
    }
  }

  if (matchedIndex === -1) {
    return NextResponse.json(
      { message: "Invalid or already used recovery code" },
      { status: 400 }
    );
  }

  // 4️⃣ Mark recovery code as used
  user.recoveryCodes[matchedIndex].used = true;

  // 5️⃣ Update password (hashed by pre-save hook)
  user.password = password;

  await user.save();

  return NextResponse.json({
    message: "Password reset successful. Please login.",
  });
}
