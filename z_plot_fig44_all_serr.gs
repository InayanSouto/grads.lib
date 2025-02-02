* This script is designed to plot a SAR backscatter cross section
* with observations overlayed.  It can be executed using a command like
*
*     grads -bpc "z_plot_fig44_all_serr all.col.var.nc"
*     grads -bpc "z_plot_fig44_all_serr all.col.var.pert.nc"
*
* - RD April 2004.

function plot(sarfile)

"set rgb    42     0    0    0"
"set rgb    43    30   30   30"
"set rgb    44    50   50   50"
"set rgb    45    70   70   70"
"set rgb    46    90   90   90"
"set rgb    47   110  110  110"
"set rgb    48   130  130  130"
"set rgb    49   150  150  150"
"set rgb    50   170  170  170"
"set rgb    51   190  190  190"
"set rgb    52   210  210  210"
"set rgb    53   255  255  255"

xpic = 4 ; string = "1.15 8.45 1.7 "xpic ; inner_decomp(string)
a = 1 ; while (a <= xpic) ; lef.a = _retlef.a ; rig.a = _retrig.a ; a = a + 1 ; endwhile
labelx.1 = _retmid.1" 10.45 a) Spd (ms`a-1`n)"
labelx.2 = _retmid.2" 10.45 b) Dir (deg)"
labelx.3 = _retmid.3" 10.45 c) U (ms`a-1`n)"
labelx.4 = _retmid.4" 10.45 d) V (ms`a-1`n)"

ypic = 1 ; string = "0.70 10.35 1.5 "ypic ; inner_decomp(string)
a = 1 ; while (a <= ypic) ; bot.a = _retlef.a ; top.a = _retrig.a ; a = a + 1 ; endwhile
a = 1 ; while (a <= ypic) ; c = ypic - a + 1 ; labely.c = "4.7 "_retrig.a + 0.08 ; a = a + 1 ; endwhile

a = 1 ; while (a <= xpic)
  b = 1 ; while (b <= ypic)
    c = ypic - b + 1
    vpage.a.c = lef.a" "rig.a" "bot.b" "top.b
  b = b + 1 ; endwhile
a = a + 1 ; endwhile

"sdfopen "sarfile
"set mproj off"
"set grid off"
"set clopts 1 3 .19"
"set xlopts 1 4 .095"
"set ylopts 1 4 .095"
"set digsiz 0.065 0.07"
"q file"
line = sublin(result,5)
levs = subwrd(line,9)
tiny = 1e-4

a = 1 ; while (a < 4)
  if (a = 1) ; var = "eo" ; endif
  if (a = 2) ; var = "eg" ; endif
  if (a = 3) ; var = "go" ; endif
  b = 1 ; while (b < 4)
    if (b = 1) ; end = "std" ; endif
    if (b = 2) ; end = "avg" ; endif
    if (b = 3) ; end = "rms" ; endif
    var.1 = var"wspd"end
    var.2 = var"wdir"end
    var.3 = var"uwnd"end
    var.4 = var"vwnd"end
    c = 1 ; while (c <= xpic)
      glomin.a.b.c = 9e9
      d = 1 ; while (d <= levs)
        "set z "levs
        "set gxout stat"
        "d "var.c ; line = sublin(result,8) ; minlev  = subwrd(line,4) + tiny
        if (minlev < glomin.a.b.c) ; glomin.a.b.c = minlev ; endif
        d = d + 1
      endwhile
# say "global min for "var.c" is "glomin.a.b.c
      c = c + 1
    endwhile
    b = b + 1
  endwhile
  a = a + 1
endwhile

a = 1 ; while (a < 2)
  if (a = 1) ; var = "eo" ; titla = "Analysis - Buoy" ; endif
  if (a = 2) ; var = "eg" ; titla = "Analysis - GEM" ; endif
  if (a = 3) ; var = "go" ; titla = "GEM - Buoy" ; endif
  b = 1 ; while (b < 3)
    if (b = 1) ; end = "std" ; title = titla" Standard Deviation"  ; endif
    if (b = 2) ; end = "avg" ; title = titla" Bias" ; endif
    if (b = 3) ; end = "rms" ; title = titla" RMS" ; endif
    var.1 = var"wspd"end  ;  ref.1 = "gowspd"end
    var.2 = var"wdir"end  ;  ref.2 = "gowdir"end
    var.3 = var"uwnd"end  ;  ref.3 = "gouwnd"end
    var.4 = var"vwnd"end  ;  ref.4 = "govwnd"end
    c = 1 ; while (c <= xpic)
      if (c != 2) ; "set dignum 2" ; endif
      if (c =  2) ; "set dignum 1" ; endif
      d = 1 ; while (d <= ypic)
        "set z "levs
        "q dims"
        line = sublin(result,4)
        leval.d = subwrd(line,6)
        "set parea "vpage.c.d
        if (d = ypic) ; "set xlab on" ; else ; "set xlab off" ; endif
        if (c =    1) ; "set ylab on" ; else ; "set ylab off" ; endif
        "set gxout stat" ; "d "ref.c ; line = sublin(result,8) ; masklev = subwrd(line,4)
                           "d "var.c ; line = sublin(result,8) ; minlev  = subwrd(line,4) + tiny
        "set gxout grfill"
        "set gridln off"
        "set lat -1.5 5.5"
        "set lon -1.5 4.5"
        "set xlabs | 0 | | 5 | | 15 | | 35 | | 75 | | 155 |"
        "set ylabs | 1e-4 | | 0.5 | | 1.5 | | 3.5 | | 7.5 | | 15.5 | | 31.5 |"
        "set ccols    49    45    0"
        "set clevs      0.25  0.75"
        if (minlev < masklev)
          "set grads off" ; "d const(maskout(const(maskout(0.5,"var.c"-"minlev"),1,-u),"masklev"-"var.c"),0,-u)"
        else
          "set grads off" ; "d const(maskout(0,"var.c"-"minlev"),0.5,-u)"
        endif
#        "set gxout contour"
#        "set ccolor 1"
#        "set cthick 8"
#        "set clab off"
#        "set clevs 0.2"
#        "set grads off" ; "d const(maskout(1,"glomin.a.b.c"-"var.c"),0,-u)"
        "set gxout grid"
        "set ccolor 1"
        "set cthick 2"
        "set grads off" ; "d "var.c
        d = d + 1
      endwhile
      c = c + 1
    endwhile

    "set vpage off"
    "set strsiz 0.13"
    "set string 1 bc 6"
    c = 1 ; while (c <= xpic)
      "draw string "labelx.c
      c = c + 1
    endwhile
    "set strsiz 0.15"
#    d = 1 ; while (d <= ypic)
#      if (leval.d = 99) ; "draw string "labely.d" SAR Dir Error = Infinite"
#      else              ; "draw string "labely.d" SAR Dir Error = "leval.d
#      endif
#      d = d + 1
#    endwhile
    "set strsiz 0.17"
#    "draw string 4.65 10.80 Analysis - Buoy Standard Deviation"
    "draw string 4.65 10.80 "title
    "draw string 4.70  8.35 SAR Error Length Scale (km)"
    "set string 1 bc 6 90"
    "draw string 0.20  9.5 SAR Obs Error"
    "draw string 0.50  9.5 (% of SAR Obs)"
    "set string 1 bc 3 0"

    "printim       "sarfile"."var"."end".all.gif gif white x850 y1100"
    "run gui_print "sarfile"."var"."end".all"
    "clear"
    b = b + 1
  endwhile
  a = a + 1
endwhile
"quit"


function inner_decomp(args)
  lef = subwrd(args,1)
  rig = subwrd(args,2)
  wid = subwrd(args,3)
  num = subwrd(args,4)
  _retmid.1   = lef + wid / 2
  _retmid.num = rig - wid / 2
  a = 2
  while (a < num)
    _retmid.a = (_retmid.num * (a-1) + _retmid.1 * (num-a)) / (num - 1)
    a = a + 1
  endwhile

  a = 1
  while (a <= num)
    _retlef.a = _retmid.a - wid / 2
    _retrig.a = _retmid.a + wid / 2
    a = a + 1
  endwhile
return
