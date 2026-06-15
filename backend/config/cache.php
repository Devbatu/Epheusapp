<?php

return [
    'default' => env('CACHE_DRIVER', 'redis'),

    'stores' => [
        'redis' => [
            'driver'     => 'redis',
            'connection' => 'cache',
            'lock_connection' => 'default',
        ],
        'array' => [
            'driver'    => 'array',
            'serialize' => false,
        ],
        'database' => [
            'driver'     => 'database',
            'connection' => null,
            'table'      => 'cache',
            'lock_table' => 'cache_locks',
        ],
    ],

    'prefix' => env('CACHE_PREFIX', 'ephesus_cache'),
];
