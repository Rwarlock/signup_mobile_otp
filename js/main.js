jQuery(document).ready(function($){

    var submitBtnSelector;
    var mobileVerified = false ;
    var mobileField = 'wpcf-customer-contact';
    var submitBtnSelector =  '.otp-submit';
    var mobileInputName = 'wpcf-customer-contact';
  //console.log(mobileInputName);
    var formElement ;
    var mobInpSelector = '';
    var mobileNumberUsed ='' ;
    var verifyOtpBtnEl= '';
    var mobileInputSelector = 'input[name="' + mobileInputName + '"]';

    function init() {
        buildFormSelector();
        insertAlertBox();
       // addRequiredInputFields();
        bindEvents();
    }

    // This inserts an alert box
    function insertAlertBox() {
        $( 'body' ).append( '<div id="alert-container"></div>' );
    }
    
    function buildFormSelector(){

        var formElement = $(submitBtnSelector).parents('form');

        if(formElement.length) {
            formElement.addClass('otp_check_form')
        }
    }


    function showAlert(message, background, close) {
        background = (background) ? background : '#3089cf';
        $('.oc-alert-pop-up').remove();
        
        var alertContainer = document.querySelector('#alert-container');

        var htmlEntityIcon = ( '#006E51' === background ) ? '✔' : 'ⓘ' ;

        var alertEl = '<div class="oc-alert-pop-up">' +
        '<div class="oc-alert-pop-up-message">' + '<span class="oc-i-icon-pop-up">' + htmlEntityIcon + '</span>' +  message + '</div>' +
        '<div class="oc-alert-pop-up-close" style="background: '+ background  + ' !important" >' + close + '</div>' +
        '</div>';

        $( alertEl ).css( 'background', background );
            $( alertContainer ).html( alertEl );

            $( '.oc-alert-pop-up-close' ).on( 'click', function ( event ) {
                $( '.oc-alert-pop-up' ).fadeOut();
            } );

    }




    // Bind all the events
    function bindEvents(){


        if (submitBtnSelector) {
            $(submitBtnSelector).on('click',function(event) {

                if(!mobileVerified) {
                    event.preventDefault();
                    showAlert('Please Verify Otp First' , '#A4C409', 'Okay');
                    return false;
                }

            });
        } else {
            $(formElement).on('submit', function(event) {
                if(!mobileVerified) {
                    event.preventDefault();
                    showAlert('Please Enter Required Fields' , '#A4C409', 'Okay');
                    return false;
                }
            });
        }

        // When SEND OTP button is Clicked
        $('#ihs-send-otp-btn').on('click' , sendOtpAndCreateVerifyButton);



        // When resend OTP button is clicked.
        $('#ihs-resend-otp-btn-id').on('click', function(){
            reCreateSendOtpButton();
            sendOtpAndCreateVerifyButton();
        });


        // When Verify OTP button is clicked.
        $('#ihs-submit-otp-btn').on('click', function(){
            var otpInputEl = $('#ihs-mobile-otp');
            var otpInputElVal = otpInputEl.val();
            var mobEl = $('input[name="' + mobileInputName + '"]');
            var mobElVal = mobEl.val();
        
            if(otpInputElVal ) {
                handleOtpVerification(otpInputElVal, mobElVal);
            } else {
                showAlert(
                    'Please Enter Otp first', '#A4C409' , 'Okay'
                );
            }

        });
        
    }
    
        $('.ihs-otp-btn').click(function(){
          $('.otp-field').show();
          $('.ihs-otp-btn').hide();
          $('.verify-otp').show();
        });
          
        $('.verify-otp').click(function(){
          $('.verify-otp').hide();
         $('.otp-submit').show();
        });  

         
          function addRequiredInputFields() {
                var mobileInputNm = mobileInputName;
                
                if(mobileInputNm) {
                    var mobInpSelector = 'input[name="' + mobileInputNm + '"]';
                    
                    htmlEl = createMobileInputAndOtherFields(mobileInputNm);
                    $(htmlEl.allOtpHtml).insertAfter(mobInpSelector);

                }
            }


    function createMobileInputAndOtherFields(mobileInputName) {
        var htmlEl = {};

        // OTP Field
        var otpInputEl = '<label id="ihs-otp-required" class="ihs-otp-required ihs-otp-hide"> ' + 'Enter OTP' + '<span class="wrap ihs-otp">' + 
        '<input type="number" id="ihs-mobile-otp" name="ihs-otp" value="" size="40" class="wpcf7-text wpcf7-validates-as-required ihs-otp-hide" aria-required="true" aria-invalid="false">' +
        '<span>' +
        '</label>';

        // Send OTP Button
       var sendOtpBtn = '<div class="ihs-otp-btn" id="ihs-send-otp-btn">' + 'Send OTP' + '</div>';

        // Submit OTP Button
        var submitOtpBtn = '<div class="ihs-otp-btn ihs-otp-hide" id="ihs-submit-otp-btn">' + 'Verify' + '</div>';

        // Resend OTP Button
        var resendOtpBtn = '<div class="ihs-otp-btn ihs-otp-hide" id="ihs-resend-otp-btn-id">' + 'Resend OTP' + '</div>';

        htmlEl.allOtpHtml = otpInputEl + sendOtpBtn + submitOtpBtn + resendOtpBtn;
        return htmlEl; 
    }


    function sendOtpAndCreateVerifyButton ( event ) {
        var mobEl = $('input[name="' + mobileInputName + '"]');
      console.log(mobEl);
        var mobElVal = mobEl.val();
        var isNoError;
        var isAllSelected = false;
        var errorArray = [];
        var mobileLengthDatabase = 10;

        isNoError = mobileValidation (mobElVal, isAllSelected, mobileLengthDatabase, errorArray);

        // If no errors send Ajax request for otp.

        if(!isNoError) {
            $( '#ihs-mobile-otp' ).removeClass( 'ihs-otp-hide' );
            sendOtpAjaxRequest( mobElVal );
        }

    }


    function mobileValidation(mobElVal, isAllSelected, mobileLengthDatabase, errorArray) {
       //var pattern = /^[7-9]{1}[0-9]{9}$/;
        if(!mobElVal) {
            errorArray.push('Enter Mobile Number');
        }

        if ( mobElVal && !isAllSelected ) {
           if(mobileLengthDatabase !== mobElVal.length) {
                errorArray.push('Enter Correct Mobile Number');
            }
           // if (pattern.test(mobElVal))
           // {
           //   errorArray.push('Please Enter the correct format');
           // }
        }

        if (errorArray.length) {
            var errorMessages = errorArray.join('</br>');
            showAlert(errorMessages, '#A4C409', 'Okay');

        }
        return errorArray.length;
    }

    function sendOtpAjaxRequest(mobileNumber) {

        $( '#ihs-send-otp-btn' ).hide();
        showAlert( "Sending OTP", '#A4C409', 'Okay' );

        var request = $.post(
            otp_verify.ajax_url,   // this url till admin-ajax.php  is given by functions.php wp_localoze_script()
            {
                action: 'send_otp_ajax_request',
                nonce: otp_verify.aj_demo_nonce,
                data: {
                    mob: mobileNumber,
                }
            }
        );

            request.done( function ( response ) {
              
                
                console.log(response);
                if( true === response.data.sent ) {
                    showAlert( "OTP is sent", '#A4C409', "Okay" )
                    
                    $( '#ihs-send-otp-btn' ).hide();
                    $( '#ihs-submit-otp-btn').removeClass( 'ihs-otp-hide' );
                    $( '.ihs-otp-required' ).removeClass( 'ihs-otp-hide' );
                    // Remove Form Fields 
                    $('.form-group').addClass('ihs-otp-hide');
                    //$( '#ihs-resend-otp-btn-id' ).removeClass( 'ihs-otp-hide' );
                    $( mobileInputSelector ).attr( 'readonly', true );
                    $( mobileInputSelector ).css( 'opacity', '0.5' );
                }

            } );

    }


    function reCreateSendOtpButton() {
        $( '#ihs-send-otp-btn' ).show();
        $( '#ihs-submit-otp-btn' ).addClass( 'ihs-otp-hide' );
        $( '.ihs-otp-required' ).addClass( 'ihs-otp-hide' );
        $('.form-group').removeClass('ihs-otp-hide');
        //$( '#ihs-resend-otp-btn-id' ).addClass( 'ihs-otp-hide' );
        $( mobileInputSelector ).attr( 'readonly', true );
        $( mobileInputSelector ).css( 'opacity', '0.5' );
        $( '#ihs-mobile-otp' ).val( '' );
    }


    function handleOtpVerification(otpInputElVal, mobElVal) {

        showAlert('Veryfing OTP...', '#A4C409', 'Okay');


        var request = $.post(
            otp_verify.ajax_url,   // this url till admin-ajax.php  is given by functions.php wp_localoze_script()
            {
                action: 'handleOtpVerification',
                nonce: otp_verify.aj_demo_nonce,
                data: {
                    otp : otpInputElVal,
                    mob : mobElVal
                }
            }
        );

        request.done(function(response){
            var status = response.data.status; 
            if(status){
                mobileVerified = true;
                showAlert(
                    'Thanks for Verification', '#A4C409' , 'Okay'
                );

                // Hide all the otp Buttons on Success
                $( '.ihs-otp-required.ihs-h' ).fadeOut( 500 );
                $( '#ihs-resend-otp-btn-id' ).fadeOut( 500 );
                $( '#ihs-verify-otp-popup-container' ).fadeOut( 500 );
                $( '.ihs-otp-required' ).fadeOut( 500 );
                $( '#ihs-submit-otp-btn' ).fadeOut( 500 );
                // Add Form Fields back
                $('.form-group').removeClass('ihs-otp-hide');
                // Add CRED Submit button 
                $('.otp-submit').fadeIn(500);
            }
            else{
                showAlert('Wrong OTP', '#943734' , 'Retry')
            }
        });


    }

    init();
 
 });