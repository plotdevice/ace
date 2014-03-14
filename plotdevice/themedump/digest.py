#!/usr/bin/env python
# encoding: utf-8
"""
digest.py

Created by Christian Swinehart on 2014/02/04.
Copyright (c) 2014 Samizdat Drafting Co All rights reserved.
"""

from __future__ import with_statement, division
import sys
import os
import re
from glob import glob
from os.path import basename
from collections import defaultdict
from pprint import pprint
import tinycss
from tinycss.color3 import parse_color
import json
py_root = os.path.dirname(os.path.abspath(__file__))
_mkdir = lambda pth: os.path.exists(pth) or os.makedirs(pth)

from jinja2 import Environment, FileSystemLoader
tmpls = Environment(loader=FileSystemLoader(py_root))

def redness(rgba):
  return rgba.alpha * (rgba.red + (rgba.red-rgba.blue) + (rgba.red-rgba.green))

def hexcolor(rgba):
  return '#%02x%02x%02x%02x'%(rgba.red*255,rgba.green*255,rgba.blue*255,rgba.alpha*255)

def rgbacolor(hexclr, alpha=None):
  hexclr = hexclr.lstrip('#')
  r, g, b, a = [int(n, 16)/255.0 for n in (hexclr[0:2], hexclr[2:4], hexclr[4:6], hexclr[6:8])]
  if alpha is not None:
    # a = min(a, alpha)
    a *= alpha
  return 'rgba(%i, %i, %i, %0.1f)'%(r*255,g*255,b*255,a)

def main():
  themes = defaultdict(lambda:defaultdict(defaultdict))

  css_themes = {}
  for theme_js in glob('../../lib/ace/theme/*.js'):
    fname_stub = theme_js.replace('.js','')
    theme_css = fname_stub + '.css'
    theme_name = basename(fname_stub).replace('_',' ').replace('-',' ').title()
    src = file(theme_js).read().decode('utf-8')
    m = re.search(r'isDark.*(true|false)', src)
    darkness = 'dark' if m.group(1)=='true' else 'light'
    isdark = darkness=='dark'

    m = re.search(r'cssClass.*"(.*?)"', src)
    theme_class = m.group(1)
    # print theme_name, theme_class, darkness
    css_themes[theme_name] = theme_class

    parser = tinycss.make_parser('page3')
    stylesheet = parser.parse_stylesheet_file(theme_css)
    textcolors = set()
    for rule in stylesheet.rules:
      selectors = rule.selector.as_css().split(',\n')
      # print selectors
      if selectors[0] == '.'+theme_class:
        colors = {}
        for d in rule.declarations:
          fgbg = d.name.split('-')[0]
          for v in d.value:
            themes[theme_name]['colors'][fgbg] = hexcolor(parse_color(v))
        themes[theme_name].update(dict(dark=isdark, theme=theme_name,
                                       module='ace/theme/'+basename(fname_stub)))
      
      # find all the text colors
      for d in rule.declarations:
        if d.name == 'color':
          for v in d.value:
            textcolors.add(parse_color(v))

            
      if any([s.endswith('.ace_selection') for s in selectors]):
        for d in rule.declarations:
          if d.name == 'background':
            for v in d.value:
              themes[theme_name]['colors']['selection'] = hexcolor(parse_color(v))

      if any([s.endswith('.ace_comment') for s in selectors]):
        for d in rule.declarations:
          if d.name == 'color':
            # themes[theme_name]['comment'] = d.value.as_css()
            for v in d.value:
              themes[theme_name]['colors']['comment'] = hexcolor(parse_color(v))
    
    reddest = [hexcolor(c) for c in sorted(textcolors, key=redness, reverse=True)]
    while reddest[0] in themes[theme_name]['colors'].values():
      reddest.pop(0)
    themes[theme_name]['colors']['error'] = reddest[0]

    # pprint(json.loads(json.dumps(themes[theme_name])))
    # t = themes[theme_name]
    # colors = dict(color=t['color'], background=t['background'], error=t['error'], comment=t['comment'])
    # repack = dict(theme=t['theme'], dark=t['dark'], css=t['css'], colors=colors)
    # themes[theme_name]['json'] = repack
    # 1/0


  with file('../themes.json','w') as f:
    # json.dump({t:themes[t]['json'] for t in themes}, f, indent=2)
    json.dump(themes, f, indent=2)

  # rows = [dict(theme=n, module=t['theme'], background=t['background'], plain=t['color'], err=t['error'], comment=t['comment']) for n,t in themes.items()]
  # # pprint(rows)
  # html = tmpls.get_template('tmpl.html')
  # info = {"rows":rows}
  # with file('themes.html','w') as f:
  #   f.write(html.render(info).encode('utf-8'))


  css = []
  tmpl = tmpls.get_template('tmpl.css')
  for theme, clazz in css_themes.items():
    # colors = {c:rgbacolor(v) for c,v in themes[theme]['colors'].items()}
    info = dict(clazz=clazz)
    info.update({c:rgbacolor(v) for c,v in themes[theme]['colors'].items()})
    info['halfselection'] = rgbacolor(themes[theme]['colors']['selection'], .7)
    print theme, clazz
    css.append(tmpl.render(info))

  with file('../autocomplete.css','w') as f:
    f.write("\n".join(css))
  
  
if __name__ == "__main__":
  main()
