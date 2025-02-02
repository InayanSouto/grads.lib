* This script loops through the *.sar.nc files listed
* in sar.nc.filelist and sets up the display so that
* NRT GTS observations can be edited - RD December 2004.

function obsedit()

filelist = "sar.nc.filelist"
firstlat = 50.0
dellat   = 0.001
firstlon = 280.0
dellon   = 0.001
showprecip = 1
showborder = 1
showincid  = 1
showcolbar = 1

count = 0                                                         ;# read all file names
say "reading "filelist
filestat = read(filelist)
while (sublin(filestat,1) = 0)
  sarfile.count = sublin(filestat,2)
  sarlevel.count = 1
  count = count + 1
  filestat = read(filelist)
endwhile
say count" sar files were found"
fileclose = close(filelist)

a = 0                                                             ;# for each file
while (a < count)                                                 ;# get its resolution
  "clear"
  stem     = substr(sarfile.a,1,25)
  resol    = substr(sarfile.a,21,5)
  obsfile  = substr(sarfile.a,1,25)".ctl"
  if (resol = "00012") ; reduce = 1 ; skipper = 64 ; border = 12 ; endif
  if (resol = "00025") ; reduce = 1 ; skipper = 32 ; border = 10 ; endif
  if (resol = "00050") ; reduce = 1 ; skipper = 16 ; border =  8 ; endif
  if (resol = "00100") ; reduce = 1 ; skipper =  8 ; border =  6 ; endif
  if (resol = "00200") ; reduce = 1 ; skipper =  4 ; border =  4 ; endif
  if (resol = "00400") ; reduce = 1 ; skipper = 32 ; border = 10 ; endif
  if (resol = "00800") ; reduce = 1 ; skipper = 32 ; border = 10 ; endif
  if (resol = "01600") ; reduce = 2 ; skipper = 16 ; border =  8 ; endif
  if (resol = "03200") ; reduce = 3 ; skipper =  8 ; border =  6 ; endif
  if (resol = "06400") ; reduce = 4 ; skipper =  4 ; border =  4 ; endif
  if (resol = "12800") ; reduce = 5 ; skipper =  2 ; border =  2 ; endif

  fila = stem".hdr"                                               ;# read the header info
  say "reading "fila
  filestat = read(fila)
  line = sublin(filestat,2)
  word = subwrd(line,2)
  product = substr(word,1,25)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  direction = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  beam = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  date    = subwrd(line,2)
  time    = subwrd(line,3)
  maxdate = subwrd(line,4)
  say date" "time
  say maxdate

  filestat = read(fila)                                           ;# get the acquisition corners
  line = sublin(filestat,2)                                       ;# and the initial view
  ullat = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  ullon = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  urlat = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  urlon = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  lllat = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  lllon = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  lrlat = subwrd(line,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  lrlon = subwrd(line,2)

  filestat = read(fila)                                           ;# and define a view with
  line = sublin(filestat,2)                                       ;# a border to allow wind
  filestat = read(fila)                                           ;# barbs to show up
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  filestat = read(fila)
  line = sublin(filestat,2)
  numazi = subwrd(line,2)
  lata = firstlat - (numazi - 1 + border) * dellat
  latb = firstlat + border * dellat
  filestat = read(fila)
  line = sublin(filestat,2)
  numrng = subwrd(line,2)
  lona = firstlon - border * dellon
  lonb = firstlon + (numrng - 1 + border) * dellon
  fileclose = close(fila)
  midlat = (lata + latb) / 2.0
  midlon = (lona + lonb) / 2.0
  if (midlon < 0) ; midlon = midlon + 360.0 ; endif               ;# then set the display script
  say "midlat = "midlat" midlon = "midlon

  displist = "/home/rdanielson/prog/graphics.grads/lib/gui_disp.gs"
  outline = ''
  filestat = write(displist,outline)
  message = sublin(filestat,1)
  if (message != 0)
    say 'error 'message' in opening and writing to 'displist ; quit
  endif
  outline = '"clear"'
  filewrite = write(displist,outline)
  outline = '"set grads off"'
  filewrite = write(displist,outline)
  outline = '"set grid off"'
  filewrite = write(displist,outline)
  outline = '"run disp_colours colour"'
  filewrite = write(displist,outline)
#  if (showborder = 1)
#    outline = '"set lat 'lata' 'latb'"'
#    filewrite = write(displist,outline)
#    outline = '"set lon 'lona' 'lonb'"'
#    filewrite = write(displist,outline)
#  endif
  outline = '"set xlab off"'
  filewrite = write(displist,outline)
  outline = '"set ylab off"'
  filewrite = write(displist,outline)
  outline = '"set digsiz 0.09"'
  filewrite = write(displist,outline)
  outline = '"set gxout grfill"'
  filewrite = write(displist,outline)
  if (showprecip = 1)
    outline = '"set black -1e-9 1e-9"'
    filewrite = write(displist,outline)
    if (showincid = 1)
      outline = '"run disp_shaded_sar_incid const(sigo,0,-u)+const(mask,0,-u)"'
    else
      outline = '"run disp_shaded_sar       const(sigo,0,-u)+const(mask,0,-u)"'
#outline = '"d sigo"'
    endif
    filewrite = write(displist,outline)
  else
    if (showincid = 1)
      outline = '"run disp_shaded_sar_incid sigo"'
    else
      outline = '"run disp_shaded_sar       sigo"'
    endif
    filewrite = write(displist,outline)
  endif
  if (showcolbar = 1)
    outline = '"run gui_cbarn 1.0 1 1.00 4.25"'
    filewrite = write(displist,outline)
  endif

  outline = '"q gxinfo"'                                          ;# define clipping regions
  filewrite = write(displist,outline)
  outline = 'line = sublin(result,2)'
  filewrite = write(displist,outline)
  outline = 'xlorig = 0'
  filewrite = write(displist,outline)
  outline = 'xrorig = subwrd(line,4)'
  filewrite = write(displist,outline)
  outline = 'yborig = 0'
  filewrite = write(displist,outline)
  outline = 'ytorig = subwrd(line,6)'
  filewrite = write(displist,outline)
  outline = 'line = sublin(result,3)'
  filewrite = write(displist,outline)
  outline = 'xl = subwrd(line,4)'
  filewrite = write(displist,outline)
  outline = 'xr = subwrd(line,6)'
  filewrite = write(displist,outline)
  outline = 'line = sublin(result,4)'
  filewrite = write(displist,outline)
  outline = 'yb = subwrd(line,4)'
  filewrite = write(displist,outline)
  outline = 'yt = subwrd(line,6)'
  filewrite = write(displist,outline)
#  outline = '"set clip "xlorig" "xrorig" "yborig" "ytorig'
#  filewrite = write(displist,outline)
#  outline = '"set clip "xl" "xr" "yb" "yt'
#  filewrite = write(displist,outline)

  outline = '"set gxout barb"'
  filewrite = write(displist,outline)
  outline = '"d uwnd;skip(vwnd,'skipper')"'
  filewrite = write(displist,outline)
  outline = '"set gxout contour"'
  filewrite = write(displist,outline)
  outline = '"set clevs 0.5"'
  filewrite = write(displist,outline)
  outline = '"set clab off"'
  filewrite = write(displist,outline)
  outline = '"set cthick 20"'
  filewrite = write(displist,outline)
  outline = '"d land"'
  filewrite = write(displist,outline)
  outline = '"set ccolor 1"'
  filewrite = write(displist,outline)
  outline = '"set cthick 15"'
  filewrite = write(displist,outline)

  stem = substr(sarfile.a,1,25)                                   ;# add the circular buoy
  filb = stem".obs"                                               ;# regions of validity
  say "reading "filb                                              ;# and plot the buoys
  countb = 0
  filestat = read(filb)
  while (sublin(filestat,1) = 0)
    line = sublin(filestat,2)
    radius = subwrd(line,27)
    obslat = subwrd(line,28)
    obslon = subwrd(line,29)
    outline = '"run disp_circle_cart 'obslat' 'obslon' 'radius' 1"'
    filewrite = write(displist,outline)
    countb = countb + 1
    filestat = read(filb)
  endwhile
  say countb" obs were found"
  fileclose = close(filb)
  if (countb > 0)
    outline = '"set gxout model"'
    filewrite = write(displist,outline)
    outline = '"set mdlopts dig3"'
    filewrite = write(displist,outline)
    outline = '"set ccolor 1"'
    filewrite = write(displist,outline)
    outline = '"d uwnd.2;vwnd.2"'
    filewrite = write(displist,outline)
  endif
#  outline = '"printim plot.'stem'.gif gif white x1100 y850"'
#  filewrite = write(displist,outline)
  fileclose = close(displist)

  "sdfopen "sarfile.a
  "open    "obsfile
  if (showborder = 1)
    "set lat "lata" "latb
    "set lon "lona" "lonb
  endif
  "define cenlat = "midlat
  "define cenlon = "midlon
  "run gui_disp"
  "q gxinfo"
  rec = sublin(result,2)
  pagex = subwrd(rec,4)
  pagey = subwrd(rec,6)

  loop = 1
  while (loop = 1)
    "set string 10 tr 3"                                          ;# draw some identifiers
    "set strsiz 0.15 0.25"
    "draw string 10.9 7.8 Case "a
    "draw string 10.9 7.4 "beam
    "set string 10 tc 3 -90"
    "draw string 10.9 4.25 "substr(sarfile.a,1,25)

    "set string 10 bc 10 0"                                       ;# then draw some buttons
    "set strsiz 0.15 0.25"
    "set line 10 1 6"
    "draw line 0.0 8.0 11.0 8.0"
    "draw line 2.2 8.0 2.2 8.5"
    "draw line 4.4 8.0 4.4 8.5"
    "draw line 6.6 8.0 6.6 8.5"
    "draw line 8.8 8.0 8.8 8.5"
    "draw string 1.1 8.2 Demote"
    "draw string 3.3 8.2 -"
    "draw string 5.5 8.2 Zoom"
    "draw string 7.7 8.2 +"
    "draw string 9.9 8.2 Promote"
    "draw line 0.0  0.5 11.0 0.5"
    "draw line 2.75 0.0 2.75 0.5"
    "draw line 5.5  0.0 5.5  0.5"
    "draw line 8.25 0.0 8.25 0.5"
    "draw string 1.375 0.15 Exit"
    "draw string 4.125 0.15 Redo File"
    "draw string 6.875 0.15 Previous File"
    "draw string 9.625 0.15 Next File"
    "set string 1 c 5"
    "set strsiz 0.15 0.15"
    "set line 1 1 3"

    "set rband 21 box 0 0 "pagex" "pagey                          ;# set up a rubber band
    "q pos"                                                       ;# then locate the click
    rec = sublin(result,1)
    x  = subwrd(rec,3)
    y  = subwrd(rec,4)
    xb = subwrd(rec,8)
    yb = subwrd(rec,9)

    if (y > 8.0)                                                  ;# if the click is above the
      if (x < 2.2)                                                ;# map then zoom around
        "draw string 4.125 0.15 Demote"
        say "!cp "stem"*hdr badobs"
            "!cp "stem"*hdr badobs"
        sarlevel.a = 0
      endif
      if (x >= 2.2 & x < 4.4)
        "run gui_zoom --"
      endif
      if (x >= 4.4 & x < 6.6)
        "set string 0 bc 10"
        "set strsiz 0.15 0.25"
        "set line 10 1 6"
        "draw recf 4.4 8.0 6.6 8.5"
        "draw string 5.5 8.2 Zoom"
        "set string 1 c 5"
        "set strsiz 0.15 0.15"
        "set line 1 1 3"
        "run gui_zoom"
      endif
      if (x >= 6.6 & x < 8.8)
        "run gui_zoom ++"
      endif
      if (x >= 8.8 & x < 11.0)
        "draw string 4.125 0.15 Promote"
        say "!rm badobs/"stem"*hdr"
            "!rm badobs/"stem"*hdr"
        sarlevel.a = 1
      endif
    endif

    if (y < 0.5)                                                  ;# if the click is below the
      if (x < 2.75)                                               ;# map then change files
        "close 2"
        "close 1"
        "clear"
        loop = 0;
        a = 2 * count
      endif
      if (x >= 2.75 & x < 5.5)
        "set string 0 bc 10"
        "set strsiz 0.15 0.25"
        "set line 10 1 6"
        "draw recf 2.75 0.0 5.5 0.5"
        "draw string 4.125 0.15 Redo File"
        "set string 1 c 5"
        "set strsiz 0.15 0.15"
        "set line 1 1 3"
        say "!/home/rdanielson/bin/station.gts.sar.obs "stem".hdr"
            "!/home/rdanielson/bin/station.gts.sar.obs "stem".hdr"
        say "!/home/rdanielson/bin/station.gts.sar.ctl.sar "stem".hdr"
            "!/home/rdanielson/bin/station.gts.sar.ctl.sar "stem".hdr"
        "close 2"
        "close 1"
        loop = 0
      endif
      if (x >= 5.5 & x < 8.25)
        "close 2"
        "close 1"
        loop = 0
        a = a - 1
        if (a < 0)
          a = 0
        endif
      endif
      if (x >= 8.25)
        "close 2"
        "close 1"
        loop = 0
        a = a + 1
        if (a = count)
          a = count - 1
        endif
      endif
    endif

    if (y > 0.5 & y < 8.0)                                        ;# otherwise mask any obs
      "q xy2w "x" "y                                              ;# contained inside the box
      rec = sublin(result,1)
      xx = subwrd(rec,3)
      yy = subwrd(rec,6)
      if (xx > 180)
        xx = xx - 360
      endif
#      say "x = math_format( %9.0f ,xx)"
#      say "y = math_format( %9.0f ,yy)"
      "q xy2w "xb" "yb
      rec = sublin(result,1)
      xxb = subwrd(rec,3)
      yyb = subwrd(rec,6)
      if (xxb > 180)
        xxb = xxb - 360
      endif
#      say "xb = math_format( %9.0f ,xxb)"
#      say "yb = math_format( %9.0f ,yyb)"
      say "!/home/rdanielson/bin/nc.modify.sar.gtsobs "stem".hdr "yy" "xx" "yyb" "xxb
          "!/home/rdanielson/bin/nc.modify.sar.gtsobs "stem".hdr "yy" "xx" "yyb" "xxb
      say "!/home/rdanielson/bin/station.gts.sar.ctl.sar "stem".hdr"
          "!/home/rdanielson/bin/station.gts.sar.ctl.sar "stem".hdr"
      "q dims"                                                    ;# close and reopen this file
      rec = sublin(result,3)                                      ;# using the current view domain
      ymin = subwrd(rec,11)
      ymax = subwrd(rec,13)
      rec = sublin(result,2)
      xmin = subwrd(rec,11)
      xmax = subwrd(rec,13)
      "close 2"
      "close 1"
      "sdfopen "sarfile.a
      "open    "obsfile
      "set y "ymin" "ymax
      "set x "xmin" "xmax
      "run gui_disp"
    endif
  endwhile
endwhile
