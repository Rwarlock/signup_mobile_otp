<?php

// Localize Script

  // Add Scripts
  function smo_add_scripts(){
    // Add Main CSS
    wp_enqueue_style('smo-main-style', plugins_url(). '/signup_mobile_otp/css/style.css');

    wp_enqueue_script('jquery');
    // Add Main JS
    wp_enqueue_script('smo-main-script', plugins_url(). '/signup_mobile_otp/js/main.js');

    wp_localize_script( 'smo-main-script', 'otp_verify', array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'aj_demo_nonce' => wp_create_nonce('aj-demo-nonce') 	
    ));
  }

  add_action('wp_enqueue_scripts', 'smo_add_scripts');