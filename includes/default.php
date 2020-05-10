<?php
// Database config
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8');

// For when we want split databases by prefix
if (!defined('DB_REMOVE_PREFIX')) define('DB_REMOVE_PREFIX', false);
if (!defined('DB_PREFIX')) define('DB_PREFIX', null);

// For when we want to manage sessions so the sessions information is available at the database
if (!defined('DB_SESSIONS')) define('DB_SESSIONS', false);
?>
