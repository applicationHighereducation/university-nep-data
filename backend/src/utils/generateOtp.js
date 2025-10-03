import bcrypt from 'bcrypt'

export function generateOtp(){
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp
}

const generatedOtp = generateOtp()

export const hashOtp = async(otp) => {
  const otpToString = generatedOtp.toString()
  const hashedOtp = await bcrypt.hash(otpToString,10)
  return hashedOtp
}

const checkOtp = async(otp,hashedOtp) => {
  const otp1 = otp.toString()
  return await bcrypt.compare(otp1,hashedOtp)
}

console.log(generatedOtp, await hashOtp(generatedOtp));

console.log(
  await checkOtp(generatedOtp, await hashOtp(generatedOtp))
);

