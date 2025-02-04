/**
 * @module AxesHelperGui
 * @description Adds <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @see {@link https://github.com/anhr/AxesHelper|AxesHelper}
 *
 * @author {@link https://anhr.github.io/AboutMe/|Andrej Hristoliubov}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

import ScaleController from '../ScaleController.js';
//import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import PositionController from '../PositionController.js';
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import { SpriteTextGui } from '../SpriteText/SpriteTextGui.js';
//import { SpriteTextGui } from 'https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/SpriteTextGui.js';

import three from '../three.js'
import Options from '../Options.js'

/**
 * Adds <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * An axis object to visualize axes.
 * @param {Options} options Followed parameters is allowed.
 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {boolean} [options.dat.axesHelperGui] false - do not adds <b>AxesHelperGui</b> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
 * @param {AxesHelper} [options.axesHelper is <a href="./module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> instance.
 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 * @param {cookie} [options.cookie] Your custom cookie function for saving and loading of the AxesHelper settings.
 * <pre>
 * See [cookieNodeJS]{@link https://github.com/anhr/commonNodeJS/tree/master/cookieNodeJS}.
 * Default cookie is not saving settings.
 * </pre>
 * @param {string} [options.cookieName] Name of the cookie is "AxesHelper" + options.cookieName.
 * @param {GUI} [gui] is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
*/
export default function AxesHelperGui( options, gui ) {

	if ( !options.boOptions ) {

		console.error( 'MoveGroupGui: call options = new Options( options ) first' );
		return;

	}
	gui = gui || options.dat.gui;
	if ( !gui || ( options.dat === false ) || ( options.dat.axesHelperGui === false ) )
		return;
	if ( options.axesHelper === false )
		return;
	if ( !options.axesHelper ) {

		console.error( 'AxesHelperGui: create AxesHelper instance first' );
		return;

	}
	
	const THREE = three.THREE, dat = three.dat;

	const scalesDefault = JSON.parse( JSON.stringify( options.scales ) ),
		groupAxesHelper = options.axesHelper.getGroup();
	Object.freeze( scalesDefault );

	options = options || {};

	//Localization

	const lang = {

		axesHelper: 'Axes Helper',

		scales: 'Scales',

		displayScales: 'Display',
		displayScalesTitle: 'Display or hide axes scales.',

		precision: 'Precision',
		precisionTitle: 'Formats a number to a specified length.',

		min: 'Min',
		max: 'Max',
			
		marks: 'Marks',
		marksTitle: 'Number of scale marks',

		axesIntersection: 'Axes Intersection',

		defaultButton: 'Default',
		defaultTitle: 'Restore default Axes Helper settings.',
		defaultAxesIntersectionTitle: 'Restore default axes intersection.',

	};
	switch ( options.getLanguageCode() ){

		case 'ru'://Russian language

			lang.axesHelper = 'Оси координат';

			lang.scales = 'Шкалы';

			lang.displayScales = 'Показать';
			lang.displayScalesTitle = 'Показать или скрыть шкалы осей координат.';

			lang.precision = 'Точность';
			lang.precisionTitle = 'Ограничить количество цифр в числе.';

			lang.min = 'Минимум';
			lang.max = 'Максимум';
				
			lang.marks = 'Риски';
			lang.marksTitle = 'Количество отметок на шкале';

			lang.axesIntersection = 'Начало координат',

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки осей координат по умолчанию.';
			lang.defaultAxesIntersectionTitle = 'Восстановить начало координат по умолчанию.';

			break;
		default://Custom language
			if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
				break;

			Object.keys( options.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = options.lang[key];

			} );

	}

	const cookie = options.dat.cookie,
		cookieName = options.dat.getCookieName( 'AxesHelper' );
	cookie.getObject( cookieName, options.scales, options.scales );

	function setSettings() {

		cookie.setObject( cookieName, options.scales );

	}

	//AxesHelper folder
	const fAxesHelper = gui.addFolder( lang.axesHelper );

	//scales folder
	const fScales = fAxesHelper.addFolder( lang.scales );

	//display scales

	const controllerDisplayScales = fScales.add( options.scales, 'display' ).onChange( function ( value ) {

		groupAxesHelper.children.forEach( function ( group ) {

			group.children.forEach( function ( group ) {

				group.visible = value;

			} );

		} );
		displayControllers();
		setSettings();
			

	} );
	dat.controllerNameAndTitle( controllerDisplayScales, lang.displayScales, lang.displayScalesTitle );

	var controllerPrecision;
	if ( options.scales.text.precision !== undefined ) {

		controllerPrecision = fScales.add( options.scales.text, 'precision', 2, 17, 1 ).onChange( function ( value ) {

			function updateSpriteTextGroup( group ) {

				group.children.forEach( function ( spriteItem ) {

					if ( spriteItem instanceof THREE.Sprite ) {

						if ( spriteItem.userData.updatePrecision !== undefined )
							spriteItem.userData.updatePrecision();

					} else if ( ( spriteItem instanceof THREE.Group ) || ( spriteItem instanceof THREE.Line ) )
						updateSpriteTextGroup( spriteItem );

				} );

			}
			updateSpriteTextGroup( groupAxesHelper );
			setSettings();

		} )
		dat.controllerNameAndTitle( controllerPrecision, lang.precision, lang.precisionTitle );

	}

	const fSpriteText = typeof SpriteTextGui === "undefined" ? undefined : SpriteTextGui( groupAxesHelper, {

		dat: {

			gui: options.dat.gui,
			cookieName: 'AxesHelper_' + options.dat.getCookieName(),

		},

	}, {

		parentFolder: fScales,

	} );

	//Axes intersection folder

	const fAxesIntersection = fAxesHelper.addFolder( lang.axesIntersection ),
		axesIntersectionControllers = { x: {}, y: {}, z: {} };
	function axesIntersection( axisName ) {

		const scale = options.scales[axisName];
		if ( !scale.isAxis() )
			return;

		const scaleControllers = axesIntersectionControllers[axisName];

		scaleControllers.controller = fAxesIntersection.add( {

			value: options.scales.posAxesIntersection[axisName],

		}, 'value',
			scale.min,
			scale.max,
			( scale.max - scale.min ) / 100 ).
			onChange( function ( value ) {

				options.scales.posAxesIntersection[axisName] = value;
				options.axesHelper.updateAxes();
				setSettings();

			} );
		dat.controllerNameAndTitle( scaleControllers.controller, scale.name );

	}
	axesIntersection( 'x' );
	axesIntersection( 'y' );
	axesIntersection( 'z' );

	//default button Axes intersection 
	var defaultParams = {

		defaultF: function ( value ) {
			
			axesIntersectionControllers.x.controller.setValue( scalesDefault.posAxesIntersection.x );
			axesIntersectionControllers.y.controller.setValue( scalesDefault.posAxesIntersection.y );
			axesIntersectionControllers.z.controller.setValue( scalesDefault.posAxesIntersection.z );

		},

	};
	dat.controllerNameAndTitle( fAxesIntersection.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultAxesIntersectionTitle );

	fAxesHelper.add( new ScaleController(
		function ( customController, action ) {

			function zoom( zoom, action ) {

				function axesZoom( axes, scaleControllers ) {

					if ( axes === undefined )
						return;//not 3D axesHelper

					axes.min = action( axes.min, zoom );
					scaleControllers.min.setValue( axes.min );

					axes.max = action( axes.max, zoom );
					scaleControllers.max.setValue( axes.max );
					scaleControllers.onchangeWindowRange();

				}

				axesZoom( options.scales.x, scalesControllers.x );
				axesZoom( options.scales.y, scalesControllers.y );
				axesZoom( options.scales.z, scalesControllers.z );

			}
			zoom( customController.controller.getValue(), action );

		}, {

		settings: { zoomMultiplier: 1.1, },
		getLanguageCode: options.getLanguageCode,

	} ) ).onChange( function ( value ) {

		console.warn( 'ScaleController.onChange' );

	} );

	function scale( axisName ) {

		const axes = options.scales[axisName];
		if ( axes === undefined )
			return;

		const scaleControllers = scalesControllers[axisName],
			axesDefault = scalesDefault[axisName];

		Object.freeze( axesDefault );

		function updateAxis() {

			groupAxesHelper.children.forEach( function ( group ) {

				if ( group.userData.axisName !== axisName )
					return;
				groupAxesHelper.remove( group );
				options.axesHelper.createAxis( axisName );

			} );

		}
		scaleControllers.updateAxis = updateAxis;

		function onchangeWindowRange() {

			updateAxis();
			setSettings();

		}
		scaleControllers.onchangeWindowRange = onchangeWindowRange;
		
		function onclick( customController, action ) {

			var zoom = customController.controller.getValue();

			axes.min = action( axes.min, zoom );
			scaleControllers.min.setValue( axes.min );

			axes.max = action( axes.max, zoom );
			scaleControllers.max.setValue( axes.max );

			onchangeWindowRange( windowRange, axes );

		}

		scaleControllers.folder = fAxesHelper.addFolder( axes.name );

		scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
			{ settings: axes, getLanguageCode: options.getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
				setSettings();

			} );

		var positionController = new PositionController( function ( shift ) {

			onclick( positionController, function ( value, zoom ) {

				value += shift;
				return value;

			} );

		}, { settings: axes, getLanguageCode: options.getLanguageCode, } );
		scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

			axes.offset = value;
			setSettings();

		} );

		//min
		scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) {

			onchangeWindowRange( windowRange );

		} );
		dat.controllerNameAndTitle( scaleControllers.min, lang.min );

		//max
		scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) {

			onchangeWindowRange( windowRange );

		} );
		dat.controllerNameAndTitle( scaleControllers.max, lang.max );

		//marks
		if ( axes.marks !== undefined ) {//w axis do not have marks

			scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) {

				onchangeWindowRange( windowRange );

			} );
			dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
				axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

		}

		//Default button
		scaleControllers.defaultButton = scaleControllers.folder.add( {

			defaultF: function ( value ) {

				axes.min = axesDefault.min;
				scaleControllers.min.setValue( axes.min );

				axes.max = axesDefault.max;
				scaleControllers.max.setValue( axes.max );

				axes.zoomMultiplier = axesDefault.zoomMultiplier;
				scaleControllers.scaleController.setValue( axes.zoomMultiplier );

				axes.offset = axesDefault.offset;
				scaleControllers.positionController.setValue( axes.offset );

				if ( axesDefault.marks !== undefined ) {

					axes.marks = axesDefault.marks;
					scaleControllers.marks.setValue( axes.marks );

				}

				onchangeWindowRange( windowRange, axes );

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle(scaleControllers.defaultButton , lang.defaultButton, lang.defaultTitle );

	}
	const scalesControllers = { x: {}, y: {}, z: {} };//, w: {} };//, t: {}, };
	function windowRange() {

		setSettings();

	}
	scale('x');
	scale('y');
	scale('z');

	//default button
	var defaultParams = {

		defaultF: function ( value ) {

			controllerDisplayScales.setValue( scalesDefault.display );
			if ( controllerPrecision !== undefined )
				controllerPrecision.setValue( scalesDefault.text.precision );
			fSpriteText.userData.restore();
			function defaulAxis( axisName ) {

				if ( scalesControllers[axisName].defaultButton )
					scalesControllers[axisName].defaultButton.object.defaultF();

			}
			defaulAxis( 'x' );
			defaulAxis( 'y' );
			defaulAxis( 'z' );

		},

	};
	dat.controllerNameAndTitle( fAxesHelper.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		
	function displayControllers() {

		var display = options.scales.display ? 'block' : 'none';
		if ( fSpriteText !== undefined )
			fSpriteText.domElement.style.display = display;
		if ( controllerPrecision !== undefined )	
			controllerPrecision.domElement.parentElement.parentElement.style.display = display;

	}
	displayControllers();
	
	if ( scalesControllers.x.updateAxis ) scalesControllers.x.updateAxis();
	if ( scalesControllers.y.updateAxis ) scalesControllers.y.updateAxis();
	if ( scalesControllers.z.updateAxis ) scalesControllers.z.updateAxis();

}
