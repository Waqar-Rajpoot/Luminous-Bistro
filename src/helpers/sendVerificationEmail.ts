import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplates/VerificationEmail";


export const sendVerificationEmail = async (
    email: string, 
    username: string, 
    verifyCode: string
) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email address',
            react: VerificationEmail({username, otp:verifyCode})
        })
        return {success: true, message: "Verification email sent successfully"}
    } catch (error) {
        console.log("Error sending verification email", error);
        return {success: false, message: "Error sending verification email"}
    }
}