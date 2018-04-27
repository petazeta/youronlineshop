<?php
if (isset($_GET["parameters"])) $parameters=json_decode($_GET["parameters"]);
else if (isset($_POST["parameters"])) $parameters=json_decode($_POST["parameters"]);

if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
  $usertyperel=$user->getRelationship(array("name" => "users_userstypes"));
  if (isset($usertyperel->children[0])) $usertype=$usertyperel->children[0]->properties->type;
}

function exitshowerror($text) {
  $myelement=new NodeMale();
  $myelement->extra=new stdClass();
  $myelement->extra->error=true;
  $myelement->extra->errorinfo=new stdClass();
  $myelement->extra->errorinfo->type=$text;
  $myelement->avoidrecursion(); //needed when insert
  header("Content-type: application/json");
  echo json_encode($myelement);
  exit();
}
switch ($parameters->action) {
  //It loads orders from the dates indicated at parameters
  //Before this is implemented we just get last month orders
  case "load orders":
    //$dateinterval="and o.creationdate >= DATE_SUB(NOW(), INTERVAL 1 MONTH) ";
    $dateinterval="";
    //$orderstatus="and o.status=0 "
    $orderstatus="";
    if ($usertype!="orders administrator") exitshowerror("User is not allowed");
    $sql="select o.*, DATE(o.creationdate) as creationdateformat, l.parent_id as user_id from orders o left join links l on l.child_id=o.id where l.relationships_id=20 " . $dateinterval . $orderstatus . "order by o.creationdate desc";
    $myreturn->properties->childtablename=TABLE_ORDERS;
    break;
  default: exitshowerror("no action registered");
}

?>
