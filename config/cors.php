<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */
     'credentials' => true,
'paths' => ['api/*', 'sanctum/csrf-cookie', 'check-login', 'categories', 'login', 'logout', 'register','*'],

    // 'paths' => ['api/*', 'sanctum/csrf-cookie', 'check-login', 'login', 'logout'], // Add your paths

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000','*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

'supports_credentials' => true,

];
