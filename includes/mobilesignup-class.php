<?php

add_action( 'wp_ajax_nopriv_send_otp_ajax_request', 'send_otp_to_the_number' );
add_action( 'wp_ajax_send_otp_ajax_request', 'send_otp_to_the_number' );  // For logged in users.

function send_otp_to_the_number() {
    
    check_ajax_referer( 'aj-demo-nonce', 'nonce' );  // This function will die if nonce is not correct.
	
    
    $mobile_number = $_POST['data']['mob'];
	
	$mobile_number = (int)$mobile_number;
    
    $otp =  rand(100000,999999);

    if(save_otp_inside_the_database($mobile_number, $otp)){
        // Sending Message 
       // $url = "http://103.247.98.91/API/SendMsg.aspx?uname=20142192&pass=edu2192&send=EDMNTR&dest=". $mobile_number . "&msg=Dear Student, Your OTP for Edumentor Form is " . $otp . " . Team Edumentor ";
        $response = wp_remote_get($url);
        $response_mobile = wp_remote_retrieve_body( $response );
        $response_mobile_number = substr($response_mobile, 0, 10);
        if( $response_mobile_number == $mobile_number ) {
            wp_send_json_success(
                array(
                    'mobile' => strval( $mobile_number ),
                    'sent' => true,
                    'response_body' => $response_mobile_number
                )
            );
        }
        else{
            wp_send_json_success(
                array(
                    'mobile' => strval( $mobile_number ),
                    'sent' => false,
                    'response' => $response_mobile_number
                )
            );
        }
    }

    wp_die();
}


function save_otp_inside_the_database($mobile_number, $otp){
    global $wpdb;
    $table_name = $wpdb->prefix . "otp_table";
    $insert = $wpdb->insert($table_name, 
    	array('number' => $mobile_number, 
    		'otp' => $otp,
    	    'otp_is_used' => '0'
    	) ); 

    if($insert) {
        return true;
    }
};


add_action( 'wp_ajax_nopriv_handleOtpVerification', 'handleOtpVerificationFunction' );
add_action( 'wp_ajax_handleOtpVerification', 'handleOtpVerificationFunction' );  // For logged in users.


function handleOtpVerificationFunction() {
    check_ajax_referer( 'aj-demo-nonce', 'nonce' );  // This function will die if nonce is not correct.

    // Get the mobile Number
    $mobile_number = $_POST['data']['mob'];
    $mobile_number = (int)$mobile_number;

    // Retrieve OTP from the user
    $otp = $_POST['data']['otp'];

    global $wpdb;

    $table_name = $wpdb->prefix . "otp_table";
    
    $rows = $wpdb->get_row('SELECT * FROM ' . $table_name .' WHERE number ='.$mobile_number.' ORDER BY ID DESC', ARRAY_A);
	
    $otp_from_database = $rows['otp'];
    
    
    if( $otp_from_database == $otp ){
        wp_send_json_success(
            array(
                'status' => true
            )
        );
    }
    else{
         wp_send_json_success(
            array(
                'status' => false
            )
        );
    }

    
}