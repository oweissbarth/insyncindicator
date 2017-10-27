/* This file is part of the insync indicator gnome shell extension
   Copyright (C) 2017 Oliver Weissbarth

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const GLib = imports.gi.GLib;





let text, button;

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });

    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path("/usr/share/icons/hicolor/48x48/status/");
    let icon = new St.Icon({ icon_name: 'insync-offline',
                             style_class: 'insync-status-icon' });

    button.set_child(icon);

    this._timeout = Mainloop.timeout_add_seconds(2, Lang.bind(this, this._refresh));

    this._refresh();

}

function _get_status() {
  let [res, out] = GLib.spawn_sync(null, ["insync", "get_status"], null, GLib.SpawnFlags.SEARCH_PATH, null);

  if(out == null) {
     return _("Error executing command.");
  }
  else {
     return out.toString().replace(/(\r\n|\n|\r)/gm,"");
  }
}

function _get_icon(status){
  var icon = new St.Icon({ icon_name: 'insync-'+status.toLowerCase(),
                           style_class: 'insync-status-icon' });


  return icon;
}

function _refresh() {
  if (this._timeout) {
    var status = _get_status();

    var icon = _get_icon(status);
    button.set_child(icon);

    Mainloop.source_remove(this._timeout);
    this._timeout = null;
  }
  this._timeout = Mainloop.timeout_add_seconds(10, Lang.bind(this, this._refresh));
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
