<?php
/*
Plugin Name: Mobile Signup OTP
Plugin URI: https://agency.krenovate.com/
Description: Mobile Number verification using OTP
Version: 1.0.0
Author: Krenvoate Tech
Author URI: https://agency.krenovate.com/
*/

// Exit if accessed directly
if(!defined('ABSPATH')){
  exit;
}

// Load Scripts
require_once(plugin_dir_path(__FILE__).'/includes/mobilesignup-scripts.php');

// Load Class
require_once(plugin_dir_path(__FILE__).'/includes/mobilesignup-class.php');
