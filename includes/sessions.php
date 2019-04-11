<?php
//set the session save handler to use our custom functions
session_set_save_handler('_open_session','_close_session','_read_session','_write_session','_destroy_session','_clean_session');
//set how long you would like the idle sessions to be valid for before garbage collection deletes them
$session_life = strtotime('-12 hours',time());
function _open_session()
{
    return true;
}

function _close_session()
{
    return true;
}

function _read_session($id)
{
    $access = time();
    
    $this->parentNode=new NodeFemale();
    $this->parentNode->properties->childtablename="TABLE_USERS";
    $this->parentNode->db_loadchildtablekeys();
    
    $sessionsrootmother=new NodeFemale();

	$sessionsrootmother->properties->childtablename="TABLE_DOMELEMENTS";
	$sessionsrootmother.properties.parenttablename="TABLE_DOMELEMENTS";
	$sessionsrootmother.loadfromhttp({action:"load root"}, function(){
    
    
    $session = db::table('sessions')->where('id',$id)->first();

    if (count($session))
    {
        $data = $session->data;
        db::table('sessions')->where('id',$id)->update([
            'access' => $access,
            'data' => $data
        ]);
        return (string)$data;

    }
     
    return false;
}

function _write_session($id, $data)
{   
    $access = time();
    $session = db::table('sessions')->where('id',$id)->first();
    if (count($session))
    {
        db::table('sessions')->where('id',$id)->update([
        'access' => $access,
        'data' => $data
    ]);
    }else{
        db::table('sessions')->insert([
            'id' => $id,
            'access' => $access,
            'data' => $data
        ]);
    }

    return true;
}

function _destroy_session($id)
{
    db::table('sessions')->where('id',$id)->delete();
    return true;
}

function _clean_session($max)
{
    global $session_life;
    db::table('sessions')->where('access', '<=', $session_life)->delete();
    return true;
}

if(session_status() == PHP_SESSION_NONE){session_start();}