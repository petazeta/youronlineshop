<?php
//Backend folder:
if (!defined('BACKEND_FOLDER')) define('BACKEND_FOLDER', 'backend/');

// Database config
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8');

// For when we want split databases by prefix
if (!defined('DB_REMOVE_PREFIX')) define('DB_REMOVE_PREFIX', false);
if (!defined('DB_PREFIX')) define('DB_PREFIX', null);

//Theme Layout
if (!defined('THEME')) define('THEME', 'retro/main.css');
?>
