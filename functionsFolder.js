/**
 * @module functionsFolder
 * @description Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
 * 
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import Options from './Options.js'
import three from './three.js'

class functionsFolder {

	/**
	 * Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
	 * @param {GUI} fParent parent folder for functions folder.
	 * @param {Object} scales [AxesHelper]{@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html} options.scales for details.
	 * @param {Function} onFinishChange callback function is called every time, when user have entered new value of the function and the function controller is lost of the focus.
	 * <pre>
	 * parameter value is new value of the function.
	 * </pre>
	 * @param {Options} options <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 * @param {object} [vector] Vector with initial text of the function
	 * @param {string} [vector.x] text of the x axis function
	 * @param {string} [vector.y] text of the y axis function
	 * @param {string} [vector.z] text of the z axis function
	*/
	constructor( fParent, onFinishChange, options, vector ) {

		if ( !options.boOptions ) {

			console.error( 'functionsFolder: call options = new Options( options ) first' );
			return;

		}
		const dat = three.dat,
			THREE = three.THREE,
			scales = options.scales;
		const _this = this;
		var boError = false,//true - обнаружена ошибка ввода. Нужно вывести сообщение об ошибке и вернуть фокус на поле управления
			boAlert = false;//предотвращает бесконечный вывод сообщения об ошибке

		//Localization

		const lang = {

			functions: 'Functions',

			defaultButton: 'Default',
			defaultTitle: 'Restore default functions.',

		};

		const _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
			: options.getLanguageCode();

		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.functions = 'Функции';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить функции.';

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

		if ( vector ) {

			vector.x = getFuncText( vector.x );
			vector.y = getFuncText( vector.y );
			vector.z = getFuncText( vector.z );

		} else vector = { x: '', y: '', z: '', }

		const fFunctions = fParent.addFolder( lang.functions ),

			//onFinishChange вызывается даже если vector не изменился. Поэтому такой onFinishChange пропускается
			vectorCur = {

				x: vector.x,
				y: vector.y,
				z: vector.z,
				w: vector.w,

			},
			cFunctions = {};
		function createControl( axisName ) {

			if ( vector[axisName] === undefined )
				return;
			cFunctions[axisName] = fFunctions.add( vector, axisName ).onFinishChange( function ( value ) {

				__onFinishChange( value, axisName, vectorCur );

			} );
			dat.controllerNameAndTitle( cFunctions[axisName], getAxisName( axisName ) );

		}
		function getAxisName( axisName ) { return scales[axisName] && scales[axisName].name ? scales[axisName].name : axisName; }
		createControl( 'x' );
		createControl( 'y' );
		createControl( 'z' );
		createControl( 'w' );

		//Default scale button
		const buttonDefault = fFunctions.add( {

			defaultF: function ( value ) {

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle( buttonDefault, lang.defaultButton, lang.defaultTitle );

		function getFuncText( func ) {

			if ( func === undefined )
				return;
			if ( typeof func === 'object' ) {

				if ( func instanceof THREE.Color ) return func.getStyle();
				if ( Array.isArray( func ) ) return JSON.stringify( func )
				func = func.func ? func.func : func;

			}
			const typeofFunc = typeof func;
			switch ( typeofFunc ) {

				case 'number':
					func = func.toString();//если это не делать будет создан NumberControllerBox, ктороый не позволяет вводить float
				case 'string':
					return func;
				case 'function':
					return func.toString().split( /return (.*)/ )[1];
				default: console.error( 'functionsFolder.getFuncText(...): typeof func = ' + typeofFunc );
					return;
			}

		}
		function __onFinishChange( value, axisName, vectorCur ) {

			if ( ( vectorCur[axisName] === value ) && !boError )
				return;
			try {

				boError = false;
				vectorCur[axisName] = value;
				var func;
				const typeofValue = typeof value;
				switch ( typeofValue ) {

					case 'string':

						var float = parseFloat( value );
						if ( float.toString() !== value ) {

							const color = value.replace( /\s/g, "" ).split( /rgb\((\d+),(\d+),(\d+)\)/ );
							if ( color.length === 5 ) func = new THREE.Color( value );
							else {

								var array;
								try {

									array = JSON.parse( value );

								} catch ( e ) { }
								if ( Array.isArray( array ) ) func = array;
								else {

									func = new Function( 't', 'a', 'b', 'return ' + value );

								}

							}

						} else func = float;
						break;

					case 'number':

						func = value;
						break;

					default:
						console.error( 'onFinishChange( ' + value + ' ): invalid type = ' + typeofValue );
						return;

				}

				//Новое значение введено правильно
				onFinishChange( func, axisName, value );
				boAlert = false;

			} catch ( e ) {

				if ( !boAlert ) {

					alert( 'Axis: ' + getAxisName( axisName ) + '. Function: "' + value + '". ' + e );
					boAlert = true;

				}
				_this.setFocus( axisName );

			}

		}

		/**
		 * set the function text
		 * @param {object} _vector vector of the axis functions.
		 * @param {object} _vector.x x axis function.
		 * @param {object} _vector.y y axis function.
		 * @param {object} _vector.z z axis function.
		 */
		this.setFunction = function ( _vector ) {

			_vector = _vector || options.vector;
			if ( !_vector )
				return;

			const vector = {

				x: _vector ? getFuncText( _vector.x ) : '',
				y: _vector ? getFuncText( _vector.y ) : '',
				z: _vector ? getFuncText( _vector.z ) : '',
				w: _vector ? getFuncText( _vector.w ) : '',

			},
				//onFinishChange вызывается даже если vector не изменился. Поэтому такой onFinishChange пропускается
				vectorCur = {

					x: vector.x,
					y: vector.y,
					z: vector.z,
					w: vector.w,

				};
			if ( !_vector.vectorDefault )
				_vector.vectorDefault = {

					x: vector.x,
					y: vector.y,
					z: vector.z,
					w: vector.w,

				};
			function setVectorAxis( axisName ) {

				if ( _vector[axisName] === undefined )
					return;
				cFunctions[axisName].__onFinishChange = function ( value ) {

					__onFinishChange( value, axisName, vectorCur );

				}
				vector[axisName] = getFuncText( _vector[axisName] );
				cFunctions[axisName].setValue( vector[axisName] );
				vectorCur[axisName] = vector[axisName];

			}
			setVectorAxis( 'x' );
			setVectorAxis( 'y' );
			var dislay = false;
			if ( _vector.z ) {

				setVectorAxis( 'z' );
				dislay = true;

			}
			buttonDefault.object.defaultF = function ( value ) {

				function setValue( axisName ) {

					if ( !cFunctions[axisName] )
						return;
					cFunctions[axisName].setValue( _vector.vectorDefault[axisName] );
					cFunctions[axisName].__onFinishChange( _vector.vectorDefault[axisName] );

				}
				setValue( 'x' );
				setValue( 'y' );
				setValue( 'z' );
				setValue( 'w' );

			}
			function dislayEl( controller, displayController ) {

				if ( controller === undefined )
					return;
				if ( typeof displayController === "boolean" )
					displayController = displayController ? 'block' : 'none';
				var el = controller.domElement;
				while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
				el.style.display = displayController;

			}
			dislayEl( cFunctions.z, dislay );
			setVectorAxis( 'w' );

		}
		this.setFunction();

		/**
		 * Display functions folder
		 * @param {string|boolean} display 'block' or true - functions folder is visible.
		 * <p>'none' or false - functions folder is hide.</p>
		 */
		this.displayFolder = function ( display ) {

			fFunctions.domElement.style.display = typeof display === "boolean" ?
				display ? 'block' : 'none' :
				display;

		}
		/**
		* set focus to controller
		* @param {string} axisName Name of the axis of the controller
		*/
		this.setFocus = function ( axisName ) {

			cFunctions[axisName].domElement.childNodes[0].focus();
			boError = true;

		}
		/**
		* update the values of the controllers of the functions
		*/
		this.update = function ( newVector ) {

			function updateAxis( axisName ) {

				if ( cFunctions[axisName].getValue() === newVector[axisName] )
					return;
				cFunctions[axisName].setValue( newVector[axisName] );

			}
			updateAxis( 'x' );
			updateAxis( 'y' );
			updateAxis( 'z' );
			updateAxis( 'w' );

		}

	}

}

export default functionsFolder;