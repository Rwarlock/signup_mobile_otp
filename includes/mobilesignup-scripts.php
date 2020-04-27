<?php
  // Add Scripts
  function smo_add_scripts(){
    // Add Main CSS
    wp_enqueue_style('smo-main-style', plugins_url(). '/signup_mobile_otp/css/style.css');
    // Add Main JS
    wp_enqueue_script('smo-main-script', plugins_url(). '/signup_mobile_otp/js/main.js');

  }

  add_action('wp_enqueue_scripts', 'smo_add_scripts');