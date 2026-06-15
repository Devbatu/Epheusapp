<?php

use Illuminate\Support\Str;

return [
    'domain' => env('HORIZON_DOMAIN'),
    'path'   => env('HORIZON_PATH', 'horizon'),
    'use'    => 'default',
    'prefix' => env('HORIZON_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_') . '_horizon:'),

    'middleware' => ['web', 'auth:sanctum'],

    'waits' => [
        'redis:default' => 60,
    ],

    'trim' => [
        'recent'            => 60,
        'pending'           => 60,
        'completed'         => 60,
        'recent_failed'     => 10080,
        'failed'            => 10080,
        'monitored'         => 10080,
    ],

    'silenced' => [],

    'metrics' => [
        'trim_snapshots' => [
            'job'   => 24,
            'queue' => 24,
        ],
    ],

    'fast_termination' => false,

    'memory_limit' => 512,

    'defaults' => [
        'supervisor-1' => [
            'connection'       => 'redis',
            'queue'            => ['high', 'default', 'low'],
            'balance'          => 'auto',
            'autoScalingStrategy' => 'time',
            'maxProcesses'     => 10,
            'maxTime'          => 0,
            'maxJobs'          => 0,
            'memory'           => 128,
            'tries'            => 3,
            'timeout'          => 60,
            'nice'             => 0,
        ],
    ],

    'environments' => [
        'production' => [
            'supervisor-high' => [
                'connection'   => 'redis',
                'queue'        => ['high'],
                'balance'      => 'auto',
                'minProcesses' => 2,
                'maxProcesses' => 10,
                'tries'        => 3,
                'timeout'      => 30,
            ],
            'supervisor-default' => [
                'connection'   => 'redis',
                'queue'        => ['default'],
                'balance'      => 'auto',
                'minProcesses' => 2,
                'maxProcesses' => 8,
                'tries'        => 3,
                'timeout'      => 60,
            ],
            'supervisor-low' => [
                'connection'   => 'redis',
                'queue'        => ['low'],
                'balance'      => 'auto',
                'minProcesses' => 1,
                'maxProcesses' => 4,
                'tries'        => 2,
                'timeout'      => 300,
            ],
        ],

        'local' => [
            'supervisor-1' => [
                'connection'   => 'redis',
                'queue'        => ['high', 'default', 'low'],
                'balance'      => 'simple',
                'minProcesses' => 1,
                'maxProcesses' => 3,
                'tries'        => 1,
                'timeout'      => 60,
            ],
        ],
    ],
];
