/**
 * PositionController is dat.GUI graphical user interface controller for control of the position of threejs 3D object
 * 
 * @see {@link https://threejs.org/} about threejs
 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import { controllers } from './dat/dat.gui.module.js';
//import { controllers } from '../../dat.gui/CustomController/build/dat.gui.module.js';

import UpDownController from './UpDownController.js';

class PositionController extends controllers.CustomController {

	/**
	 * dat.GUI graphical user interface for control of the position of threejs 3D object.
	 * Base class <a href="../../dat.gui/CustomController/src/dat/controllers/CustomController.js" target="_blank">CustomController</a>
	 * @extends controllers.CustomController.
	 * @param {Event} onclickController
	 * @param {object} [options={}] the following options are available:
	 * @param {number} [options.settings={}] time settings.
	 * @param {number} [options.settings.offset=0.1] offset.
	 * @param {number} [options.min=0.1] Minimal offset.
	 * @param {number} [options.max=10] Maximal offset.
	 * @param {number} [options.step=0.1] step of offset.
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 */
	constructor( onclickController, options ) {

		options = options || {};
		options.settings = options.settings || {}; 
		var settings = options.settings; 

		options.min = options.min || 0.1;
		options.max = options.max || 10;
		settings.offset = settings.offset || 0.1;
		options.step = options.step || 0.1;

		super( {

			offset: settings.offset,
			property: function ( customController ) {

				//Localization

				var lang = {

					//Position
					offset: 'Offset',
					add: 'add',
					subtract: 'subtract',
					wheelPosition: 'Scroll the mouse wheel to change the position',

				};

				var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
					: options.getLanguageCode();
				switch ( _languageCode ) {

					case 'ru'://Russian language

						//Position
						lang.offset = 'Сдвиг';
						lang.add = 'добавить';
						lang.subtract = 'вычесть';
						lang.wheelPosition = 'Прокрутите колесико мыши для изменения позиции';

						break;
					default://Custom language
						if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
							break;

						Object.keys( options.lang ).forEach( function ( key ) {

							if ( lang[key] === undefined )
								return;
							lang[key] = options.lang[key];

						} );

				}

				//

				var buttons = {}, addButton = UpDownController.addButton;
				buttons.Label = addButton( lang.offset, {

					title: lang.wheelPosition,
					onwheel: function ( delta ) {

						var shift = customController.controller.getValue();
						onclickController( delta > 0 ? shift : - shift );

					}

				} );
				buttons.in = addButton( '↑', {

					title: lang.add,
					onclick: function () {

						onclickController( customController.controller.getValue() );

					}

				} );
				buttons.out = addButton( '↓', {

					title: lang.subtract,
					onclick: function () {

						onclickController( - customController.controller.getValue() );

					}

				} );
				return buttons;

			},

		}, 'offset', options.min, options.max, options.step );
		if ( this.property === undefined )
			console.error( 'init() returns ' + this.property );

	}

}
export default PositionController;