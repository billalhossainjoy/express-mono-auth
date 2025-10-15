import { asyncHandler } from "../../lib/AsyncHandler";
import { LoginSchema, SignUpSchema } from "./schema/auth.schema";
import { CookieOptions, JWT } from "./jwt";
import { HttpError } from "../../lib/HttpError";
import { ResponseApi } from "../../lib/ResponseApi";
import { AuthService } from "./auth.service";

export class AuthController {
  signup = asyncHandler(async (req, res) => {
    const user = await AuthService.signup(SignUpSchema.parse(req.body));
    const [accessToken, refreshToken] =
      JWT.generateAccessTokenRefreshToken(user);

    res.cookie("accessToken", accessToken, CookieOptions.accessCookie);
    res.cookie("refreshToken", refreshToken, CookieOptions.refreshCookie);

    res.header("Authorization", `Bearer ${accessToken}`);
    res.header("x-refresh-token", refreshToken);

    return ResponseApi(res, 201, "Signed up successfully");
  });

  login = asyncHandler(async (req, res) => {
    const user = await AuthService.login(LoginSchema.parse(req.body));

    const [accessToken, refreshToken] =
      JWT.generateAccessTokenRefreshToken(user);

    res.cookie("accessToken", accessToken, CookieOptions.accessCookie);
    res.cookie("refreshToken", refreshToken, CookieOptions.refreshCookie);

    res.header("Authorization", `Bearer ${accessToken}`);
    res.header("x-refresh-token", refreshToken);

    return ResponseApi(res, 200, "Logged in successfully");
  });

  logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", CookieOptions.accessCookie);
    res.clearCookie("refreshToken", CookieOptions.refreshCookie);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });

  refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    const account = await AuthService.refreshToken(token);

    const [accessToken, refreshToken] =
      JWT.generateAccessTokenRefreshToken(account);

    res.cookie("accessToken", accessToken, CookieOptions.accessCookie);
    res.cookie("refreshToken", refreshToken, CookieOptions.refreshCookie);

    res.header("Authorization", `Bearer ${accessToken}`);
    res.header("x-refresh-token", refreshToken);

    return ResponseApi(res, 200, "Refreshed successfully");
  });

  verifyOtp = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const { id } = req.account;

    if (await AuthService.checkIsVerified(id))
      return res.status(200).json({
        success: false,
        message: "Account already verified",
        data: {
          isVerified: true,
        },
      });

    await AuthService.verifyOtp(id, otp);

    return ResponseApi(res, 200, "Verified successfully");
  });

  verifyByToken = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) throw new HttpError(401, "Token is required");
    await AuthService.verifyByToken(token);

    return ResponseApi(res, 200, "Verified successfully");
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await AuthService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: {
        email,
      },
    });
  });

  forgotByOtp = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;
    await AuthService.forgotOtpVerify({ otp, email });

    return ResponseApi(res, 200, "Email sent successfully", {
      otp,
      email,
    });
  });

  resetPasswordByOtp = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;
    await AuthService.resetPasswordByOtp(email, otp, password);
    return ResponseApi(res, 200, "Password reset successfully");
  });

  resetPasswordByToken = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    await AuthService.resetPasswordByToken(token, password);
    return ResponseApi(res, 200, "Password reset successfully");
  });

  getSession = asyncHandler(async (req, res) => {
    return ResponseApi(res, 200, "Session", {
      account: req.account,
    });
  });
}
