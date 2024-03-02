<?php

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;

if (!function_exists('websocketcall')) {
    function websocketcall($options)
    {
        $client = new Client();
        $headers = [
            'Content-Type' => 'application/json'
        ];
        $body = '{"message": '.$options.'}';
        $request = new Request('POST', 'http://'.env("WEBSOCKET_LOOKOUT", "localhost").':'.env("WEBSOCKET_LOOKOUT_PORT",3000).'/broadcast', $headers, $body);
        $res = $client->sendAsync($request)->wait();
        $data = json_decode($res->getBody(), true);
        $success = $data['success'];
        if ($success){
            return json_decode(json_decode($data['feedback'],true)['message'],true);
        }else{
            if ($data['error']){
                return "NO_FEEDBACK";
            }else{
                return null;
            }
        }

    }
}
?>
