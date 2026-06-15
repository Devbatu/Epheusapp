<?php

namespace App\Domain\User\Services;

use App\Domain\User\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(string $email, string $password, string $ip, string $userAgent): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been disabled.'],
            ]);
        }

        // Check 2FA
        if ($user->two_factor_enabled) {
            $twoFaToken = Str::random(40);
            Cache::put("2fa_pending:{$twoFaToken}", $user->id, now()->addMinutes(10));

            return ['requires_2fa' => true, 'two_fa_token' => $twoFaToken];
        }

        $user->update(['last_login_at' => now(), 'last_login_ip' => $ip]);

        return [
            'user'  => $user->load(['roles', 'permissions']),
            'token' => $user->createToken('api', ['*'], now()->addDays(30))->plainTextToken,
        ];
    }

    public function refreshToken(User $user): string
    {
        $user->currentAccessToken()->delete();

        return $user->createToken('api', ['*'], now()->addDays(30))->plainTextToken;
    }

    public function sendPasswordResetLink(string $email): void
    {
        Password::sendResetLink(['email' => $email]);
    }

    public function resetPassword(array $data): void
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
    }
}
