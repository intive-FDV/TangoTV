#! /bin/bash

REF_SASS=.ref_sass"$$"
REF_COFFEE=.ref_coffee"$$"
LS_ARCHIVOS_COFFEE=.ls_archivos"$$"
INTERVALO_MONITOREO=1
#TIPO=""

#Captura el evento Ctrl+C para cerrar el programa
trap salir EXIT
#trap salir INT

#####################
verificar_coffee(){
    
    for line in $(cat "$1"); do 
       if [ coffee/"$line" -nt "$REF_COFFEE" ] 
           then 
                #echo cambio
                coffee -l -o js/ -c coffee/
                echo '.ref_coffee' > "$REF_COFFEE"
                echo "Recompilando Archivos (coffee):  ["$(date +%T)"]"
                return
            
        fi
    done
    #return
}
####################
verificar_sass(){
       if [ sass/main.sass -nt "$REF_SASS" ] 
           then 
                sass sass/main.sass:css/main.css
                echo '.ref_sass' > "$REF_SASS"
                echo "Recompilando Archivos (sass):  ["$(date +%T)"]"
        fi
}
################3

monitorear_coffee(){
    echo "Monitoreando archivos coffee (CTRL+C para finalizar)"
    ls coffee/ > "$LS_ARCHIVOS_COFFEE"
    while [ true ]
        do
            verificar_coffee "$LS_ARCHIVOS_COFFEE"
            sleep "$INTERVALO_MONITOREO"
        done
}
###################
monitorear_sass(){
    echo "Monitoreando archivos sass (CTRL+C para finalizar)"
    while [ true ]
        do
            verificar_sass
            sleep "$INTERVALO_MONITOREO"
        done

}
#################
limpiar(){
    ##echo limpiando
    ##if [ "$TIPO" = "" ] 
      ##  then return
    ##fi
   
    ##if [ "$TIPO" = "SASS" ]
      ##  then
            if [ -e "$REF_SASS" ]
                then rm "$REF_SASS"
            fi
   ## fi
    
    if [ -e "$REF_COFFEE" ]
        then rm "$REF_COFFEE"
    fi
    if [ -e "$LS_ARCHIVOS_COFFEE" ]
        then rm "$LS_ARCHIVOS_COFFEE"
    fi
}

salir(){
    echo
    echo "Eliminando archivos creados.."
    limpiar
    exit 0
}

#################################################
#limpiar
if [ "$2" ] 
    then INTERVALO_MONITOREO="$2"
fi

case $1 in
    coffee)
      #  TIPO="COFFEE"
        monitorear_coffee
	;;
    sass)
       # TIPO="SASS"
        monitorear_sass
    ;;
    *)
	echo "Uso: $0 {coffee|sass} {intervalo de monitoreo}" >&2
    echo "Por ahora esta solamente la opcion de monitorear el sass O el coffee, no los dos a la ves."
    echo "El segundo parametro es un valor en segundos que indica cada cuanto se deben revisar los archivos. El valor por defecto es 1s."
	exit 3
	;;
esac

exit 0
