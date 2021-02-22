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

import { dat } from './dat/dat.module.js';

/**
 * Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
 * @param {GUI} fParent parent folder for functions folder.
 * @param {Object} scales [AxesHelper]{@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html} options.scales for details.
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {Function} onFinishChange callback function is called every time, when user have entered new value of the function and the function controller is lost of the focus.
 * <pre>
 * parameter value is new value of the function.
 * </pre>
 * @param {object} [options] the following options are available:
 * @param {Function} [options.getLanguageCode="en"] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
 * @param {object} [options.vector] Vector with initial text of the function
 * @param {object} [options.vector.x] text of the x axis function
 * @param {object} [options.vector.y] text of the y axis function
 * @param {object} [options.vector.z] text of the z axis function
*/
const functionsFolder = function ( fParent, scales, THREE, onFinishChange, options = {} ) {

	const _this = this;
	var boError = false;

	//Localization

	const getLanguageCode = options.getLanguageCode || function () { return 'en'; };

	const lang = {

		functions: 'Functions',

		defaultButton: 'Default',
		defaultTitle: 'Restore default functions.',

	};

	const _languageCode = getLanguageCode();

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

	const fFunctions = fParent.addFolder( lang.functions ),
		vector = {

			x: options.vector ? getFuncText( options.vector.x ) : '',
			y: options.vector ? getFuncText( options.vector.y ) : '',
			z: options.vector ? getFuncText( options.vector.z ) : '',
			w: options.vector ? getFuncText( options.vector.w ) : '',

		},
		//onFinishChange вызывается даже если vector не изменился. Поэтому такой onFinishChange пропускается
		vectorCur = {

			x: vector.x,
			y: vector.y,
			z: vector.z,
			w: vector.w,

		},
		cFunctions = { };
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

	function getFuncText ( func ) {

		if ( func === undefined )
			return;
		if ( typeof func === 'object' ) {

			if ( func instanceof THREE.Color ) return func.getStyle();
			if ( Array.isArray( func ) ) return JSON.stringify(func)
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

						//						const color = value.replace(/\s/g, "").toLowerCase().split( /rgb\((\d+),(\d+),(\d+)\)/ );
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
			onFinishChange( func, axisName );

		} catch ( e ) {

			alert( 'Axis: ' + getAxisName( axisName ) + '. Function: "' + value + '". ' + e );
			_this.setFocus( axisName );

		}

	}

	/**
	 * set the function text
	 * @function functionsFolder.
	 * setFunction
	 * @param {object} _vector vector of the axis functions.
	 * @param {object} _vector.x x axis function.
	 * @param {object} _vector.y y axis function.
	 * @param {object} _vector.z z axis function.
	 */
	this.setFunction = function ( _vector/*, boDefault*/ ) {

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
			cFunctions[axisName].__onFinishChange = function( value ){

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
		buttonDefault.object.defaultF = function( value ) {

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
	/**
	 * Display functions folder
	 * @function functionsFolder.
	 * displayFolder
	 * @param {string} display display is 'block' - functions folder is visible.
	 * <pre>
	 * 'none' - functions folder is hide.
	 * </pre>
	 */
	this.displayFolder = function ( display ) { fFunctions.domElement.style.display = display; }
	 /**
	 * set focus to controller
	 * @function functionsFolder.
	 * setFocus
	 * @param {string} axisName Name of the axis of the controller
	 */
	this.setFocus = function ( axisName ) {

		cFunctions[axisName].domElement.childNodes[0].focus();
		boError = true;

	}

}

export default functionsFolder;