<?php

use Illuminate\Support\Facades\Schedule;

// Stock & expiration alerts — run daily at 08:00
Schedule::command('ephesus:stock-alerts')->dailyAt('08:00');
