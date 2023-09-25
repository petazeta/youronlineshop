#!/bin/bash

echo "hola"
curl -s http://localhost:6001/layouts.cmd && echo "done1" &
curl -s http://localhost:6001/layouts.cmd && echo "done2" & 
curl -s http://localhost:6001/layouts.cmd && echo "done3" &
curl -s http://localhost:6001/layouts.cmd && echo "done4" &
curl -s http://localhost:6001/layouts.cmd && echo "done5" &

wait

echo "adios"
