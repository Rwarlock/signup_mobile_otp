<?php

function parijatDatabaseCall($data){

$url = "https://wallet.parijat.in/api_ms/app.php?rquest=".$data['rquest'];

                                $payloadName = json_encode($data);

                                //print_r($payloadName);

                                $headers = array('Content-Type:application/json');                         

                                $process = curl_init($url);

                                curl_setopt($process, CURLOPT_CUSTOMREQUEST, "POST");

                                curl_setopt($process, CURLOPT_POSTFIELDS, $payloadName);

                                curl_setopt($process, CURLOPT_RETURNTRANSFER, true);

                                curl_setopt($process, CURLOPT_HTTPHEADER,$headers);

                                curl_setopt($process, CURLOPT_SSL_VERIFYPEER, false);

                                curl_setopt($process, CURLOPT_TIMEOUT, 40);

                                $response=curl_exec($process);

                                //print_r($response);

                                if(!$response){

                                                return "Error In Data";

                                } else {

                                                return $response;

                                }

                                 curl_close($process);

                             start_headers();

                                if(!$response){

                                                echo "Error 1";die;

                                                return false;

                                } else{

                                                echo "Done";

                                                return  $response;

                                }

}