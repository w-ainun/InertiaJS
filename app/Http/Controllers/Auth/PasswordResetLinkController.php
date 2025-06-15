<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            // We will send the password reset link to this user. Once we have attempted
            // to send the link, we will examine the response then see the message we
            // need to show to the user. Finally, we'll send out a proper response.
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status == Password::RESET_LINK_SENT) {
                return back()->with('status', __('Link reset password telah dikirim ke email Anda.'));
            }

            // If an error was returned by the password broker, we will get this message
            // translated so we can notify a user of the problem. We'll redirect back
            // to where the users came from so they can attempt this process again.
            throw ValidationException::withMessages([
                'email' => [($status)],
            ]);
        } catch (\Exception $e) {
            // Log error untuk debugging
            \Log::error('Password reset email error: ' . $e->getMessage());
            
            return back()->with('status', __('Link reset password telah dikirim jika email terdaftar.'));
        }
    }
}