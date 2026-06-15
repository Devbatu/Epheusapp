<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BranchAccessMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Super Admin / Company Admin bypass branch restriction
        if ($user->hasAnyRole(['super-admin', 'company-admin', 'regional-manager'])) {
            return $next($request);
        }

        // Branch-level users must have a branch assigned
        if (! $user->branch_id) {
            return response()->json(['message' => 'No branch assigned to this account.'], 403);
        }

        // Inject branch context so controllers can use $request->user()->branch_id
        return $next($request);
    }
}
