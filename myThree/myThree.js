/**
 * @module MyThree
 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 */

//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
import cookie from '../cookieNodeJS/cookie.js';

import Player from '../player/player.js';
import loadFile from '../loadFileNodeJS/loadFile.js';
import MyPoints from '../myPoints/myPoints.js';

import StereoEffect from '../StereoEffect/StereoEffect.js';
//import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';

//import CanvasMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/canvasMenu.js';
import CanvasMenu from '../canvasMenu/canvasMenu.js';

import { getLanguageCode } from '../lang.js';
//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

import CreateFullScreenSettings from '../createFullScreenSettings.js';

import { AxesHelper } from '../AxesHelper/AxesHelper.js';
//import { AxesHelper } from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelper.js';
import { AxesHelperGui } from '../AxesHelper/AxesHelperGui.js';
//import { AxesHelperGui } from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelperGui.js';

//import { OrbitControls } from 'http://localhost/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from '../../../three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

//import OrbitControlsGui from 'http://localhost/anhr/commonNodeJS/master/OrbitControlsGui.js';
import OrbitControlsGui from '../OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js';

import loadScript from '../loadScriptNodeJS/loadScript.js';
import { dat } from '../dat/dat.module.js';

//import controllerPlay from '../controllerPlay/controllerPlay.js';
//import controllerPlay from 'https://raw.githack.com/anhr/commonNodeJS/master/controllerPlay/controllerPlay.js';

//import { GuiSelectPoint, getWorldPosition } from '../guiSelectPoint/guiSelectPoint.js';
import GuiSelectPoint from '../guiSelectPoint/guiSelectPoint.js';
//GuiSelectPoint.setTHREE( THREE );

import { getWorldPosition } from '../getPosition.js';
//getPositionSetTHREE( THREE );

import PositionController from '../PositionController.js';

import { SpriteText } from '../SpriteText/SpriteText.js';
//SpriteText.setTHREE( THREE );

import { SpriteTextGui } from '../SpriteText/SpriteTextGui.js';

import ColorPicker from '../colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

import MoveGroupGui from '../MoveGroupGui.js';

//import CameraGui from 'http://localhost/anhr/commonNodeJS/master/CameraGui.js';
import CameraGui from '../CameraGui.js';
//import CameraGui from 'https://raw.githack.com/anhr/commonNodeJS/master/CameraGui.js';

//https://github.com/mrdoob/stats.js/
//import Stats from '../../../three.js/dev/examples/jsm/libs/stats.module.js';

import FrustumPoints from '../frustumPoints/frustumPoints.js';
import three from '../three.js'
import setOptions from '../setOptions.js'
import FolderPoint from '../folderPoint.js'

/*проверка duplicate THREE
//import * as THREE2 from 'https://threejs.org/build/three.module.js';
import * as THREE2 from '../../../three.js/dev/build/three.module.js';
three.THREE = THREE2;
*/

//var THREE;

var debug = {

	opacity: 1 //непрозрачность frustumPoints

};

//Thanks to https://stackoverflow.com/a/27369985/5175935
//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
const getCurrentScript = function () {

	if ( document.currentScript && ( document.currentScript.src !== '' ) )
		return document.currentScript.src;
	const scripts = document.getElementsByTagName( 'script' ),
		str = scripts[scripts.length - 1].src;
	if ( str !== '' )
		return src;
	//Thanks to https://stackoverflow.com/a/42594856/5175935
	return new Error().stack.match( /(https?:[^:]*)/ )[0];

};
//Thanks to https://stackoverflow.com/a/27369985/5175935
const getCurrentScriptPath = function () {
	const script = getCurrentScript(),
		path = script.substring( 0, script.lastIndexOf( '/' ) );
	return path;
};
//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
const currentScriptPath = getCurrentScriptPath();

function arrayContainersF() {

	var array = [];
	this.push = function ( elContainer ) {

		array.push( elContainer );

	};
	this.display = function ( elContainer, fullScreen ) {

		array.forEach( function ( itemElContainer ) {

			itemElContainer.style.display = ( itemElContainer === elContainer ) || !fullScreen ? 'block' : 'none';

		} );

	}

};
var arrayContainers = new arrayContainersF();

/*
 * if you asynhronous creates two or more myThreejs same time, then you will receive the error message:
 * 
 * Uncaught ReferenceError: WEBGL is not defined
 * 
 * For resolving of the issue I have remembers myThreejs parameters in the arrayCreates
 * and creates next myThreejs only after creating of previous myThreejs.
 */
var arrayCreates = [];

class MyThree {

	/**
	 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
	 * @param {any} _THREE [THREE]{@link https://github.com/anhr/three.js|THREE}
	 * @param {createXDobjects} createXDobjects callback creates my 3D objects.
	 * @param {object} [options] the following options are available:
	 * @param {HTMLElement|string} [options.elContainer=document.getElementById( "containerDSE" ) or a div element, child of body] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
	 * <pre>
	 * If a string, then is id of the HTMLElement.
	 * </pre>
	 * @param {THREE.PerspectiveCamera} [options.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {THREE.Vector3} [options.camera.position=new THREE.Vector3( 0.4, 0.4, 2 )] camera position.
	 * @param {THREE.Vector3} [options.camera.scale=new THREE.Vector3( 1, 1, 1 )] camera scale.
	 * @param {THREE.Scene} [options.scene] [Scene]{@link https://threejs.org/docs/index.html#api/en/scenes/Scene}.
	 * @param {THREE.Vector3} [options.scene.position=new THREE.Vector3( 0, 0, 0 )] scene position.
	 * @param {Object|boolean} [options.orbitControls={}] {} - use [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls} allow the camera to orbit around a target.
	 * <pre>
	 * false - no orbit controls.
	 * </pre>
	 * @param {boolean} [options.orbitControls.gui=true] true - displays the <a href="../../jsdoc/OrbitControlsGui/index.html" target="_blank">orbit controls gui</a>.
	 * @param {Object|boolean} [options.axesHelper={}] {} - add the <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * <pre>
	 * false - axes is not visible.
	 * </pre>
	 * @param {boolean} [options.axesHelper.gui=true] true - displays the <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelper gui</a>.
	 * @param {object} [options.spriteText] spriteText options. See <a href="../../SpriteText/jsdoc/index.html" target="_blank">SpriteText</a> options for details. Default undefined.
	 * @param {object} [options.stereoEffect] use <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
	 * @param {number} [options.stereoEffect.spatialMultiplex] <a href="../../StereoEffect/jsdoc/module-StereoEffect.html#~spatialMultiplexsIndexs" target="_blank">Enumeration of available stereo modes</a>.
	 * @param {object} [options.dat] {} - use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.cookie=true] true - save to cookie all user settings
	 * @param {boolean} [options.dat.playerGui=true] true - adds a <a href="../../player/jsdoc/module-Player.html#~Player.gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.guiSelectPoint=true] true - displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
	 * @param {boolean} [options.dat.guiStereoEffect=true] true - Adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.guiFrustumPoints=true] true - Adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {object} [options.dat.moveScene={}] true - displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
	 * @param {boolean} [options.canvasMenu=false] true - use my <a href="../../canvasMenu/jsdoc/index.html" target="_blank">dropdown menu for canvas</a> in my version of [dat.gui]{@link https://github.com/anhr/dat.gui}.
	 * @param {object} [options.cameraTarget] camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
	 * @param {object} [options.frustumPoints] Creates a <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
	 * @param {MyThree.ColorPicker.palette|boolean|number} [options.palette=White color of all points] Color of points.
	 * <pre>
	 * <b>MyThree.ColorPicker.palette</b> - is <b>new ColorPicker.palette( ... )</b>
	 * See <a href="../../colorpicker/jsdoc/index.html" target="_blank">ColorPicker</a> for details.
	 * <b>boolean</b>: true - <b>new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.BGRW } )</b>;
	 * <b>number</b>: is <b>MyThree.ColorPicker.paletteIndexes</b>. See <a href="../../colorpicker/jsdoc/module-ColorPicker.html#~paletteIndexes" target="_blank">ColorPicker.paletteIndexes</a> for details.
	 * </pre>
	 * @param {object} [options.player] 3D objects animation. See <b>options.settings</b> param of the <a href="../../player/jsdoc/module-Player.html" target="_blank">Player</a>
	 * @param {object} [options.canvas] canvas properties
	 * @param {number} [options.canvas.width] width of the canvas
	 * @param {number} [options.canvas.height] height of the canvas
	 * @param {boolean} [options.canvas.fullScreen] default is full screen. false - no full screen
	 * @param {number} [options.a=1] Can be use as 'a' parameter of the Function. See arrayFuncs for details.
	 * @param {number} [options.b=0] Can be use as 'b' parameter of the Function. See arrayFuncs for details.
	 *
	 * @param {object} [options.point] point settings. Applies to points with ShaderMaterial.
	 * <pre>
	 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
	 * The size of the point seems constant and does not depend on the distance to the camera.
	 * </pre>
	 * @param {number} [options.point.size=0.02] The apparent angular size of a point in radians.
	 * @param {object} [options.stats] Use JavaScript Performance Monitor. [stats]{@link https://github.com/mrdoob/stats.js/} .
	 * @param {object} [options.scales] axes scales. See <a href="../../AxesHelper/jsdoc/module-AxesHelper.html" target="_blank">AxesHelper</a> <b>options.scales</b> for details.
	 * @param {boolean} [options.scales.display=true] true - displays the label and scale of the axes.
	 * @param {number} [options.scales.text] options of the text of the marks. See <a href="../../AxesHelper/jsdoc/module-AxesHelper.html" target="_blank">AxesHelper</a> <b>options.scales.text</b> for details.
	 *
	 * @param {object} [options.scales.x] X axis options.
	 * @param {number} [options.scales.x.zoomMultiplier=1.1] zoom multiplier.
	 * @param {number} [options.scales.x.offset=0.1] position offset. Default
	 * @param {string} [options.scales.x.name="X"] axis name.
	 * @param {number} [options.scales.x.min=-1] Minimum range of the x axis.
	 * @param {number} [options.scales.x.max=1] Maximum range of the x axis.
	 * @param {number} [options.scales.x.marks=5] Number of x scale marks.
	 *
	 * @param {object} [options.scales.y] Y axis options.
	 * @param {number} [options.scales.y.zoomMultiplier=1.1] zoom multiplier.
	 * @param {number} [options.scales.y.offset=0.1] position offset.
	 * @param {string} [options.scales.y.name="Y"] axis name.
	 * @param {number} [options.scales.y.min=-1] Minimum range of the y axis.
	 * @param {number} [options.scales.y.max=1] Maximum range of the y axis.
	 * @param {number} [options.scales.y.marks=5] Number of y scale marks.
	 *
	 * @param {object} [options.scales.z] Z axis options.
	 * @param {number} [options.scales.z.zoomMultiplier=1.1] zoom multiplier.
	 * @param {number} [options.scales.z.offset=0.1] position offset.
	 * @param {string} [options.scales.z.name="Z"] axis name.
	 * @param {number} [options.scales.z.min=-1] Minimum range of the z axis.
	 * @param {number} [options.scales.z.max=1] Maximum range of the z axis.
	 * @param {number} [options.scales.z.marks=5] Number of z scale marks.
	 *
	 * @param {object} [options.scales.w] w axis options.
	 * @param {number} [options.scales.w.zoomMultiplier=1.1] zoom multiplier.
	 * @param {number} [options.scales.w.offset=0.1] position offset.
	 * @param {string} [options.scales.w.name="W"] axis name.
	 * @param {number} [options.scales.w.min=-1] Minimum range of the w axis.
	 * @param {number} [options.scales.w.max=1] Maximum range of the w axis.
	 *
	 * @todo If you want to use raycaster (working out what objects in the 3d space the mouse is over) [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster},
	 * <pre>
	 * please add following object into your 3D Object userdata:
	 * your3dObject.userData.raycaster = {

			onIntersection: function ( raycaster, intersection, scene, INTERSECTED ) {

				//Mouse is over of your 3D object event
				//TO DO something
				//For example you can use
				options.raycaster.onIntersection( intersection, scene );
				//for displaying of the position of your 3D object
				//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

			},
			onIntersectionOut: function ( scene, INTERSECTED ) {

				//Mouse is out of your 3D object event
				//TO DO something
				//For example you can use
				options.raycaster.onIntersectionOut( scene );
				//for hide of the position of your 3D object that was displayed in onIntersection
				//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

			},
			onMouseDown: function ( raycaster, intersection, scene ) {

				//User has clicked over your 3D object
				//TO DO something
				//For example:
				var position = raycaster.stereo.getPosition( intersection );
				alert( 'You are clicked the "' + intersection.object.type + '" type object.'
					+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
					+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

			},

		}
	 * </pre>
	 * <a href="../Examples/html/" target="_blank">Example</a>.
	 */
	constructor( createXDobjects, options ) {

/*
		THREE = _THREE;
		three.THREE = THREE;
*/		
		const THREE = three.THREE;
//		Player.setTHREE( THREE );
//		Player.assign();

		var myThreejs = this;

		arrayCreates.push( {

			createXDobjects: createXDobjects,
			options: options,

		} );
		if ( arrayCreates.length > 1 )
			return;

		options = options || {};

		options.camera = options.camera || {};
		options.camera.position = options.camera.position || new THREE.Vector3( 0.4, 0.4, 2 );
		options.camera.scale = options.camera.scale || new THREE.Vector3( 1, 1, 1 );

/*сейчас использую options.dat.cookie
		if ( options.cookie === undefined )
			options.cookie = new cookie.defaultCookie();
		else options.cookie = cookie;
*/
		if ( options.dat ) {

			if ( options.dat.cookie !== false ) options.dat.cookie = true;
			if ( options.dat.cookie === true ) options.dat.cookie = cookie;
			else options.dat.cookie = new cookie.defaultCookie();

		}

		if ( options.palette !== undefined ) {

			switch( typeof options.palette ){

				case 'number':
					options.palette = new ColorPicker.palette( { palette: options.palette } );
					break;
				case 'boolean':
					if ( options.palette )
						options.palette = new ColorPicker.palette();// { palette: ColorPicker.paletteIndexes.BGRW } );
					break;
				default: {
					
					if ( options.palette instanceof ColorPicker.palette === false )
						console.error( 'MyThree: invalid typeof options.palette: ' + typeof options.palette );

				}
			}
//			ColorPicker.palette.setTHREE( THREE );

		}
/*
		if ( options.arrayCloud !== undefined ) {

			options.arrayCloud.getCloudsCount = function () {

				var count = 0;
				for ( var i = 0; i < options.arrayCloud.length; i++ ) {

					var arrayVectors = options.arrayCloud[i];
					count += arrayVectors.length;

				}
				return count;

			}
			options.arrayCloud.cFrustumPointsF = FrustumPoints.cFrustumPointsF;

		}
*/
		options.a = options.a || 1;
		options.b = options.b || 0;

		options.scale = 1;

		options.point = options.point || {};
		options.point.size = options.point.size || 5.0;
		function getCanvasName() {
			return typeof options.elContainer === "object" ?
				options.elContainer.id :
				typeof options.elContainer === "string" ?
					options.elContainer :
					'';
		}

		var camera, group, scene, canvas;

		function onloadScripts() {

			var elContainer = options.elContainer === undefined ? document.getElementById( "containerDSE" ) :
				typeof options.elContainer === "string" ? document.getElementById( options.elContainer ) : options.elContainer;
			if ( elContainer === null ) {

				if ( typeof options.elContainer === "string" )
					console.warn( 'The ' + options.elContainer + ' element was not detected.' );
				elContainer = document.createElement( 'div' );
				document.querySelector( 'body' ).appendChild( elContainer );

			}
			arrayContainers.push( elContainer );
			elContainer.innerHTML = loadFile.sync( currentScriptPath + '/canvasContainer.html' );
			elContainer = elContainer.querySelector( '.container' );


			//ось z смотрит точно на камеру
			//camera.rotation = 0
			//Камера не повернута
			//camera.position.x = 0;
			//camera.position.y = 0;
			//camera.position.z = 2;
			//options.camera.position = new THREE.Vector3( 0, 0, 2 );

			//ось x смотрит точно на камеру
			//camera.rotation.x = 0
			//camera.rotation.y = 1.5707963267948966 = PI / 2 = 90 degrees
			//camera.rotation.z = 0
			//Поворот камеры по оси y на 90 градусов
			//camera.position.x = 2;
			//camera.position.y = 0;
			//camera.position.z = 0;
			//		options.camera.position = new THREE.Vector3( 2, 0, 0 );

			const raycaster = new THREE.Raycaster(),

				//point size
				defaultPoint = {},

				//uses only if stereo effects does not exists
				mouse = new THREE.Vector2();

			var renderer,

//				cursor,//default

				controls, stereoEffect, player,// frustumPoints,

				mouseenter = false,//true - мышка находится над gui или canvasMenu
				//В этом случае не надо обрабатывать событие elContainer 'pointerdown'
				//по которому выбирается точка на canvas.
				//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
				//Тогда открывается папка Meshes и все органы управления сдвигаются вниз. Это неудобно.
				//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

				canvasMenu, fOptions,// axesHelper,// INTERSECTED = [], scale = options.scale, colorsHelper = 0x80,
				gui, rendererSizeDefault, cameraPosition,// fullScreen,

				//point size
				pointSize, 

				stats,

				//uses only if stereo effects does not exists
				intersects,// mouse = new THREE.Vector2(), 

				//https://www.khronos.org/webgl/wiki/HandlingContextLost
				requestId;

			canvas = elContainer.querySelector( 'canvas' );
			//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
//			const gl = canvas.getContext( 'webgl' );

			//raycaster

			elContainer.addEventListener( 'mousemove', onDocumentMouseMove, false );

			//ATTENTION!!! The 'mousedown' event is not fired if you use new version of the OrbitControls.
			//See "OrbitControls: Implement Pointer events." commit https://github.com/mrdoob/three.js/commit/1422e36e9facbdc5f9d86cf6b97b005a2723a24a#diff-3285de3826a51619836a5c9adc6bee74
			//elContainer.addEventListener( 'mousedown', onDocumentMouseDown, { capture: true } );
			elContainer.addEventListener( 'pointerdown', onDocumentMouseDown, { capture: true } );

			function isFullScreen() {

				if ( canvasMenu ) return canvasMenu.isFullScreen();
				if ( options.canvas ) return options.canvas.fullScreen !== false;
				return true;

			}
			//https://www.khronos.org/webgl/wiki/HandlingContextLost


			if ( typeof WebGLDebugUtils !== 'undefined' )
				canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas( canvas );

			//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
			canvas.addEventListener( "webglcontextlost", function ( event ) {

				event.preventDefault();
				if ( requestId !== undefined )
					window.cancelAnimationFrame( requestId );
				else console.error( 'myThreejs.create.onloadScripts: requestId = ' + requestId );
				clearThree( scene );
				raycaster = undefined;
				rendererSizeDefault.onFullScreenToggle( true );
				alert( lang.webglcontextlost );

			}, false );
			canvas.addEventListener( "webglcontextrestored", function () {

				console.warn( 'webglcontextrestored' );
				init();
				animate();

			}, false );

			//

			init();
			animate();

			function init() {

				var optionsScene = { position: new THREE.Vector3() }

				// CAMERA

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
				camera.position.copy( options.camera.position );
				camera.scale.copy( options.camera.scale );
				camera.userData.default = { options: JSON.parse( JSON.stringify( options.camera ) ), }

				//для возврата созданной камеры обратно в код, который вызвал new MyThree
				//В частности это используется для создания точки, за которой будет следить камера
				options.camera = camera;

				options.point.sizePointsMaterial = 100;//size of points with material is not ShaderMaterial is options.point.size / options.point.sizePointsMaterial

				//добавляю camera.userData.default что бы изменять положение камеры во время проигрывания
				if ( options.cameraTarget ) {
	
					options.cameraTarget.camera = camera;
					Player.cameraTarget.init( options.cameraTarget );
									
				}
/*				
if ( typeof Player !== 'undefined' )
	Player.cameraTarget.init( {

		boLook: true,
		camera: camera,
		rotation: {

			//angle: Math.PI,
			//angle: new Function( 't', 'return 5*t' ),
			//angle: [0, Math.PI / 2],
			//angle: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }, { t: 10, v: Math.PI / 2 },  { t: 11, v: 0 }],
			//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

		},
		//distanceToCamera: new THREE.Vector3( 0, 0, 2 ),
		//distanceToCamera: new THREE.Vector3( 0, 0, [{ t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 }] ),
		distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+3*t' ) ),

	} );
*/	
				// SCENE

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );
				scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

				group = new THREE.Group();
				scene.add( group );

				if ( options.frustumPoints ) {

//					const cFrustumPoints = options.guiSelectPoint ? options.guiSelectPoint.getFrustumPoints() : undefined;
//					options.frustumPoints = new FrustumPoints( camera, group, options,
					new FrustumPoints( camera, group, canvas, {

						options: options,
						optionsShaderMaterial: {//points options. Default is { }

							point: {//points options. Default is {}

								size: 0.01,//Size of each frustum point.Default is 0;

							},

							//Stereo options. Available only if user has selected a stereo mode (spatialMultiplex !== spatialMultiplex.Mono)
							stereo: {

								//lines: false, // Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode.Default is true
								//hide: 10, // Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.Default is 0
								//opacity: 1,//Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque. Default is 0.3

							},

							//

							//zCount: 5,// The count of layers of the frustum of the camera's field of view. Default is 50
							//yCount: 3,// The count of vertical points for each z level of the  frustum of the camera's field of view.. Default is 30

							cookie: options.dat ? options.dat.cookie : undefined,
							cookieName: getCanvasName(),

							//изменение размеров усеченной пирамиды FrustumPoints

							//near: 10,// Shift of the frustum layer near to the camera in percents.
							//0 percents - no shift.
							//100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды.
							//Default is 0

							//far: 70,// Shift of the frustum layer far to the camera in percents.
							// 0 percents - no shift.
							// 100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды.
							// Default is 0

							//base: 70,// Scale of the base of the frustum points in percents.
							// 0 base is null
							// 100 no scale
							// Default is 100

							//square: true,// true - Square base of the frustum points.Default is false

						},

					} );
//					if ( cFrustumPoints ) cFrustumPoints.setFrustumPoints( options.frustumPoints );

				}

				//

				renderer = new THREE.WebGLRenderer( {

					antialias: true,
					canvas: canvas,

				} );
				options.renderer = renderer;

				options.cursor = renderer.domElement.style.cursor;

				//StereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
				if ( options.stereoEffect ) {

					if ( options.stereoEffect.spatialMultiplex === undefined )
						options.stereoEffect.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;
					if ( StereoEffect !== undefined ) {

						stereoEffect = new StereoEffect( renderer, {

							spatialMultiplex: options.stereoEffect.spatialMultiplex,//StereoEffect.spatialMultiplexsIndexs.Mono, //.SbS,
							far: camera.far,
							camera: camera,
							//stereoAspect: 1,
							elParent: canvas.parentElement,
							rememberSize: true,

						} );
						//						stereoEffect.options.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;

					} else console.warn( 'stereoEffect = ' + stereoEffect );

				} else StereoEffect.assign();//.setTHREE( THREE );

				//Light

				//A light that gets emitted from a single point in all directions.
				function pointLight() {

					var strLight = 'mathBoxLight',
						light,// = scene.getObjectByName( strLight ),
						position = new THREE.Vector3( 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale ), controllers = {},
						multiplier = 2 * options.scale;

					function isLight() {

						return light !== undefined;

					}
					this.add = function ( positionCur ) {

						position = positionCur || position;
						if ( !isLight() ) {

							light = new THREE.PointLight( 0xffffff, 1 );
							light.position.copy( position );
							light.name = strLight;
							scene.add( light );

						}// else console.error( 'duplicate ' + strLight );
						return light;

					};
					this.remove = function () {

						if ( light == undefined )
							return;
						scene.remove( light );
						//delete light;//Parsing error: Deleting local variable in strict mode
						light = undefined;

					};
					this.controls = function ( group, folder, scales, folderName ) {

						if ( folder === undefined )
							return;

						var fLight = folder.addFolder( folderName || lang.light ),
							lightSource;

						//displayLight
						dat.controllerNameAndTitle( fLight.add( { display: false }, 'display' ).onChange( function ( value ) {

							if ( value ) {

								function getPoints( pointVerticesSrc, color ) {

									var geometry = Array.isArray( pointVerticesSrc ) ?
										new THREE.BufferGeometry().setFromPoints( pointVerticesSrc ) : pointVerticesSrc;
									var threshold = 0.05 * options.scale;
									return new THREE.Points( geometry,
										new THREE.PointsMaterial( {

											color: color === undefined ? 0xffffff : color,
											//map: texture,
											size: threshold,
											alphaTest: 0.5

										} ) );

								}
								lightSource = getPoints( [light.position] );
								group.add( lightSource );

							} else {

								group.remove( lightSource );
								//delete lightSource;//Parsing error: Deleting local variable in strict mode
								lightSource = undefined;

							}

						} ), lang.displayLight, lang.displayLightTitle );

						//move light
						function guiLightAxis( axesName ) {

							const scale = scales[axesName];
							if ( !scale )
								return;
							controllers[axesName] =
								fLight.add( light.position, axesName, scale.min * multiplier, scale.max * multiplier )
									.onChange( function ( value ) {

										if ( lightSource === undefined )
											return;

										lightSource.geometry.attributes.position.array[axesId] = value;
										lightSource.geometry.attributes.position.needsUpdate = true;

									} );
							dat.controllerNameAndTitle( controllers[axesName], scale.name );

						}
						guiLightAxis( 'x' );
						guiLightAxis( 'y' );
						guiLightAxis( 'z' );

						var restore = {

							restore: function () {

								controllers[axesEnum.x].setValue( position.x );
								controllers[axesEnum.y].setValue( position.y );
								controllers[axesEnum.z].setValue( position.z );

							}
						};
						dat.controllerNameAndTitle( fLight.add( restore, 'restore' ), lang.defaultButton, lang.restoreLightTitle );

					};
					this.windowRange = function ( scales ) {

						function setLimits( axisId ) {

							var axisName = axesEnum.getName( axisId );
							controllers[axisId].max( scales[axisName].max * multiplier );
							controllers[axisId].min( scales[axisName].min * multiplier );

						}
						setLimits( axesEnum.x );
						setLimits( axesEnum.y );
						setLimits( axesEnum.z );
					}
					return this;

				};
				var pointLight1 = new pointLight();
				pointLight1.add( new THREE.Vector3( 2 * options.scale, 2 * options.scale, 2 * options.scale ) );
				var pointLight2 = new pointLight();
				pointLight2.add( new THREE.Vector3( -2 * options.scale, -2 * options.scale, -2 * options.scale ) );

				//item.material.size is NaN if item.material is ShaderMaterial
				//Влияет только на точки без ShaderMaterial
				raycaster.params.Points.threshold = 0.02;//0.01;
				if ( raycaster.setStereoEffect !== undefined )
					raycaster.setStereoEffect( {

						renderer: renderer,
						camera: camera,
						stereoEffect: stereoEffect,
						raycasterEvents: false,

					} );
				options.raycaster.addParticle = function ( item ) {

					if ( raycaster.stereo !== undefined )
						raycaster.stereo.addParticle( item );

				}
				options.raycaster.removeParticle = function ( item ) {

					if ( raycaster.stereo !== undefined )
						raycaster.stereo.removeParticle( item );

				}

				//

				//dat-gui JavaScript Controller Library
				//https://github.com/dataarts/dat.gui
				if ( ( options.dat !== undefined ) ) {

					if ( options.dat.guiSelectPoint !== false ) options.dat.guiSelectPoint = true;
					if ( options.dat.guiStereoEffect !== false ) options.dat.guiStereoEffect = true;
					if ( options.dat.moveScene !== false ) options.dat.moveScene = {}; 
					if ( options.dat.cameraGui !== false ) options.dat.cameraGui = true;
					if ( options.dat.guiFrustumPoints !== false ) options.dat.guiFrustumPoints = true;
/*
					if ( options.dat.cookie !== false ) options.dat.cookie = true;

					if ( options.dat.cookie === true ) options.dat.cookie = cookie;
					else options.dat.cookie = new cookie.defaultCookie();
*/

					if ( gui !== undefined ) {

						for ( var i = gui.__controllers.length - 1; i >= 0; i-- )
							gui.remove( gui.__controllers[i] );
						var folders = Object.keys( gui.__folders );
						for ( var i = folders.length - 1; i >= 0; i-- )
							gui.removeFolder( gui.__folders[folders[i]] );

					} else {

						gui = new dat.GUI( {

							//autoPlace: false,//Убрать скроллинг когда окно gui не влазит в окно браузера
							//closed: true,//Icorrect "Open Controls" button name

						} );
						gui.domElement.addEventListener( 'mouseenter', function ( event ) { mouseenter = true; } );
						gui.domElement.addEventListener( 'mouseleave', function ( event ) { mouseenter = false; } );

					}

					//for debugging
					if ( typeof WebGLDebugUtils !== "undefined" )
						gui.add( {

							loseContext: function ( value ) {

								canvas.loseContext();
								//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
								//gl.getExtension( 'WEBGL_lose_context' ).loseContext();

							},

						}, 'loseContext' );

					//Close gui window
					if ( gui.__closeButton.click !== undefined )//for compatibility with Safari 5.1.7 for Windows
						gui.__closeButton.click();

					//Thanks to https://stackoverflow.com/questions/41404643/place-dat-gui-strictly-inside-three-js-scene-without-iframe
					elContainer.querySelector( '#my-gui-container' ).appendChild( gui.domElement );

				}

				//My custom controller for playing of 3D objects.
				if ( options.player !== false )  options.player = options.player || {};
				if ( options.player ) {

					player = new Player( group, {

						onSelectScene: function ( index, t ) {

							options.boPlayer = true;
							if ( options.frustumPoints !== undefined )
								options.frustumPoints.updateCloudPoints();

						},
						selectPlaySceneOptions: options,
						settings: options.player,
						cameraTarget: { camera: camera, },
						onChangeScaleT: function ( scale ) {

							if ( player !== undefined )
								player.onChangeScale( scale );
							group.children.forEach( function ( mesh ) {

								if ( ( mesh.userData.player === undefined ) || ( mesh.userData.player.arrayFuncs === undefined ) || ( typeof mesh.userData.player.arrayFuncs === "function" ) )
									return;
								mesh.userData.player.arrayFuncs.forEach( function ( vector ) {

									if ( vector.line === undefined )
										return;
									vector.line.remove();
									vector.line = new Player.traceLine( /*THREE, scene, */options );

								} );

							} );

						},

					} );
					if ( gui !== undefined ) {

						new player.PlayController( gui, getLanguageCode );
//						controllerPlay.create( player, gui );

					}

				} 
				if ( gui !== undefined ) {

					fOptions = gui.addFolder( lang.settings );
					if ( player && ( options.dat.playerGui !== false ) )
						player.gui( fOptions, {

							getLanguageCode: getLanguageCode,
							cookie: options.dat.cookie,
							cookieName: '_' + getCanvasName(),

						} );

				}

				//Settings for all SpriteText added to scene and child groups
				if ( fOptions )
					SpriteTextGui( SpriteText, fOptions, scene, {

						getLanguageCode: getLanguageCode,
						//settings: { zoomMultiplier: 1.5, },
						cookie: options.dat.cookie,
						cookieName: getCanvasName(),
						options: {

							//rotation: 0,
							//textHeight: 0.1 * scale,//0.05,
							textHeight: 0.05,

							//Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
							//Вертикальное поле обзора камеры, снизу вверх, в градусах.
							//Если добавить эту настройку, то видимый размер текста не будет зависить от изменения camera.fov.
							//Тогда textHeight будет вычисляться как options.fov * textHeight / 50
							//Если не определить поле textHeight (см. выше) то textHeight = 0.04,
							fov: camera.fov,

							//sizeAttenuation: false,//true,//Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.

						}

					} );

				if ( stereoEffect && gui && options.dat.guiStereoEffect ) {

					stereoEffect.gui( fOptions, {

						getLanguageCode: getLanguageCode,
						cookie: options.dat.cookie,
						gui: gui,
						stereoEffect: stereoEffect,
						onChangeMode: function ( mode ) {

							switch ( mode ) {

								case StereoEffect.spatialMultiplexsIndexs.Mono:
									break;
								case StereoEffect.spatialMultiplexsIndexs.SbS:
								case StereoEffect.spatialMultiplexsIndexs.TaB:
									break;
								default: console.error( 'myThreejs: Invalid spatialMultiplexIndex = ' + mode );
									return;

							}
							if ( options.frustumPoints !== undefined )
								options.frustumPoints.updateGuiSelectPoint();

						},

					} );

				}

				function getRendererSize() {

					var style = {

						position: renderer.domElement.style.position,
						left: renderer.domElement.style.left,
						top: renderer.domElement.style.top,
						width: renderer.domElement.style.width,
						height: renderer.domElement.style.height,

					},
						sizeOriginal = new THREE.Vector2();
					renderer.getSize( sizeOriginal );
					return {

						onFullScreenToggle: function ( fs ) {

							arrayContainers.display( elContainer.parentElement, !fs );

						},

					};

				};
				rendererSizeDefault = getRendererSize();
				
				if ( options.canvasMenu ) {

					if ( ( canvasMenu === undefined ) ) {

						canvasMenu = new CanvasMenu( renderer, {

							getLanguageCode: getLanguageCode,
							stereoEffect: stereoEffect,
							player: player,
							fullScreen: {

								camera: camera,
								fullScreen: !options.canvas || ( options.canvas.fullScreen !== false ),
								THREE: THREE,
								onFullScreenToggle: function ( fullScreen ) {

									rendererSizeDefault.onFullScreenToggle( fullScreen );

								},
								onFullScreen: function ( fullScreen, elContainer ) {

									rendererSizeDefault.onFullScreenToggle( !fullScreen );

								},

							},
							onOver: function ( _mouseenter ) {

								mouseenter = _mouseenter;

							},

						} );
						options.canvasMenu = canvasMenu;

					} else canvasMenu.setPlayer( player );

				} else if ( !options.canvas || ( options.canvas.fullScreen !== false ) ) {

					new CreateFullScreenSettings( THREE, renderer, camera,
						{


						} ).setFullScreen();
		
				}
				renderer.setSize( ( options.canvas !== undefined ) && ( options.canvas.width !== undefined ) ? options.canvas.width : canvas.clientWidth,
					( options.canvas !== undefined ) && ( options.canvas.height !== undefined ) ? options.canvas.height : canvas.clientHeight );

				//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
				if ( options.orbitControls !== false )  options.orbitControls = options.orbitControls || {};
				if ( options.orbitControls ) {

					controls = new OrbitControls( camera, renderer.domElement );
					controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
					controls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
					controls.update();
					if ( typeof Player !== 'undefined' ) Player.orbitControls = controls;//for cameraTarget
/*
					controls.addEventListener( 'change', function () {

						if ( options.frustumPoints !== undefined )
							options.frustumPoints.onChangeControls();

					} );
*/

				}

				// helper

				if ( options.axesHelper !== false )  options.axesHelper = options.axesHelper || {};
				if ( options.axesHelper ) {

//					var cookieName = getCanvasName();
					const gui = options.axesHelper.gui
					options.axesHelper = new AxesHelper( scene, {

						scene: { position: scene.position, },
//						scale: options.axesHelper.scale,
						color: 'rgba(255, 255, 255, 0.5)',
						scales: options.scales,

					} );
//					options.axesHelper = axesHelper;
					options.axesHelper.options.gui = gui;

					optionsScene.position = scene.position;

					if ( controls !== undefined )
						controls.update();//if scale != 1 and position != 0 of the screen, то после открытия canvas положение картинки смещено. Положение восстанавливается только если подвигать мышью
				}

//frustumPoints				if ( options.arrayCloud )//Array of points with cloud

				if ( gui && options.dat.guiSelectPoint ) {

//					var intersection;
					options.guiSelectPoint = new GuiSelectPoint( THREE, {

						axesHelper: options.axesHelper,
						options: options,
						getLanguageCode: getLanguageCode,
						cameraTarget: {

							camera: camera,
							orbitControls: controls,

						},
/*						
						setIntersection: function ( _intersection ) {

							intersection = _intersection;

						},
*/						
						//displays the trace of the movement of all points of the mesh
						pointsControls: function ( fPoints, dislayEl, getMesh ) { },
						//displays the trace of the point movement
						pointControls: function ( fPoint, dislayEl, getMesh ) { },

					} );
					options.guiSelectPoint.add( gui );

				}

				defaultPoint.size = options.point.size;

				var pointName = 'Point_' + getCanvasName();
				if ( options.dat ) options.dat.cookie.getObject( pointName, options.point, options.point );

				options.spriteText = options.spriteText || {};

				createXDobjects( group, options );

				if ( options.frustumPoints ) options.frustumPoints.create( renderer, { orbitControls: controls } );

				//На случай когда указана точка, за которой следит камера и когда Player не создан
				if ( !options.player ) {

					Player.selectPlayScene( group );//, Player.getTime(), 0 );

				}
				options.boPlayer = false;

				//default setting for each 3D object
				group.children.forEach( function ( mesh ) {

					options.saveMeshDefault( mesh );

				} );
				if ( gui !== undefined ) {

					//THREE.AxesHelper gui
					if ( ( options.scene === undefined ) && ( typeof scene !== 'undefined' ) )
						options.scene = scene;
//					if ( options.dat.axesHelperGui === true )
					if ( ( options.axesHelper !== false ) && ( options.axesHelper.options.gui !== false ) ) {

						AxesHelperGui( options.axesHelper, fOptions, {

							cookie: options.dat.cookie,
							cookieName: getCanvasName(),
							getLanguageCode: getLanguageCode,

						} );
					}
					if ( options.spriteText && options.spriteText.gui ) {

						SpriteTextGui( gui, group, {

							parentFolder: fOptions,
							getLanguageCode: getLanguageCode,
							cookie: options.cookie,
							options: options.spriteText,

						} );

					}
					if ( options.dat.moveScene )
						new MoveGroupGui( group, fOptions, {

							cookie: options.dat.cookie,
							cookieName: getCanvasName(),
							getLanguageCode: getLanguageCode,
							lang: { moveGroup: lang.moveGroup, },
							guiSelectPoint: options.guiSelectPoint,
							scales: options.scales,
							axesHelper: options.axesHelper,

						} );

					//OrbitControls gui

//					if ( ( options.orbitControls !== undefined ) && ( options.orbitControls.gui ) )
					if ( options.orbitControls !== false ) {

						if ( options.orbitControls.gui !== false ) options.orbitControls.gui = options.orbitControls.gui || true;
						if ( options.orbitControls.gui )
							Player.orbitControlsGui = new OrbitControlsGui( fOptions, controls, {

								getLanguageCode: getLanguageCode,
								scales: options.scales,

							} );

					}

					//camera gui

					if ( options.dat.cameraGui )
						new CameraGui( fOptions, camera, THREE, Player, {

							getLanguageCode: getLanguageCode,
							scales: options.scales,
							orbitControls: controls,

						} );

					// light

//					const scales = options.axesHelper === undefined ? options.scales : options.axesHelper.options.scales;
					const scales = options.axesHelper === false ? options.scales : options.axesHelper.options.scales;
					pointLight1.controls( group, fOptions, scales, lang.light + ' 1' );
					pointLight2.controls( group, fOptions, scales, lang.light + ' 2' );

					//point
/*
					function FolderPoint( folder, point, defaultPoint, setSize, PCOptions ) {

						PCOptions = PCOptions || {};

						PCOptions.min = PCOptions.min || 0.01;
						PCOptions.max = PCOptions.max || 1;
						PCOptions.settings = PCOptions.settings || {};
						PCOptions.settings.offset = PCOptions.settings.offset || 1;
						PCOptions.step = PCOptions.step || 0.01;

						var fPoint = folder.addFolder( lang.pointSettings ),
							fSize = fPoint.addFolder( lang.size );
						dat.folderNameAndTitle( fSize, lang.size, lang.sizeTitle );
						this.display = function ( display ) { fPoint.domElement.style.display = display; }

						fSize.add( new PositionController( function ( shift ) {

							setSize( point.size + shift );

						}, PCOptions//{ offset: 0.01, min: 0.01, max: 0.1, step: 0.01 }
						) );

						//size
						this.size = dat.controllerZeroStep( fSize, point, 'size', function ( value ) {

							setSize( value );

						} );
						dat.controllerNameAndTitle( this.size, lang.size, lang.sizeTitle );

						//point default button
						dat.controllerNameAndTitle( fPoint.add( {

							defaultF: function ( value ) {

								setSize( defaultPoint.size );

							},

						}, 'defaultF' ), lang.defaultButton, lang.defaultPointTitle );

					}
*/
					var folderPoint = new FolderPoint( fOptions, options.point, function ( value ) {

						if ( value === undefined )
							value = options.point.size;
						if ( value < 0 )
							value = 0;
						group.children.forEach( function ( mesh ) {

							if ( ( mesh.type !== 'Points' ) || mesh.userData.boFrustumPoints )
								return;
							if ( mesh.material.uniforms === undefined )
								mesh.material.size = value / options.point.sizePointsMaterial;//PointsMaterial
							else mesh.material.uniforms.pointSize.value = value;//shaderMaterial

						} );
						folderPoint.size.setValue( value );
						options.point.size = value;
						options.dat.cookie.setObject( pointName, options.point );

					}, {

							defaultPoint: defaultPoint,
/*
							point: options.point,
							PCOptions: {

								settings: { offset: 1 }

							},
*/							
							getLanguageCode: getLanguageCode,

					} )

					//Frustum points
					if ( options.frustumPoints && options.dat.guiFrustumPoints )
						options.frustumPoints.gui( fOptions, {

							getLanguageCode: getLanguageCode,
							cookie: cookie,

						} );

					//default button
					camera.userData.default.setDefault = function(){

						controls.target = new THREE.Vector3();
						camera.position.copy( camera.userData.default.options.position );
						scene.position.copy( optionsScene.position );
						//scene.position.add( options.axesHelper.position );
						scene.position.add( options.scene.position );
						//scene.position.copy( options.scene.position );
						controls.object.position.copy( camera.position );
						controls.update();
						
					}
					dat.controllerNameAndTitle( gui.add( {
						defaultF: function ( value ) {

							Player.selectPlayScene( group );

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

				}

				//raycaster

				group.children.forEach( function ( item ) {

					if ( item.userData.raycaster !== undefined ) {

						if ( raycaster.stereo !== undefined ) {

							if ( !raycaster.stereo.isAddedToParticles( item ) )//Если добавляются точки myPoints то в них particle уже добавлен
								raycaster.stereo.addParticle( item );

						}

					}

				} );

				//https://github.com/mrdoob/stats.js/
				if ( options.stats !== undefined ) {

					try {

						stats = new Stats();
						elContainer.appendChild( stats.dom );

					} catch ( e ) {

						console.error( e + ". Please import Stats from '../../../three.js/dev/examples/jsm/libs/stats.module.js';" );

					}

				}

				window.addEventListener( 'resize', onResize, false );

			}
			function onResize() {

				var size;
				if ( isFullScreen() )
					size = new THREE.Vector2( window.innerWidth, window.innerHeight );
				else {

					size = new THREE.Vector2();
					renderer.getSize( size );

				}
				camera.aspect = size.x / size.y;
				camera.updateProjectionMatrix();

				renderer.setSize( size.x, size.y );
				if ( options.frustumPoints !== undefined )
					options.frustumPoints.update();

			}
			function onDocumentMouseMove( event ) {

				if ( typeof raycaster !== 'undefined' ) {

					if ( raycaster.stereo !== undefined )
						raycaster.stereo.onDocumentMouseMove( event );
					else {

						// Test of the old version of THREE.Raycaster
						event.preventDefault();
						var left = renderer.domElement.offsetLeft,
							top = renderer.domElement.offsetTop,
							size = new THREE.Vector2;
						renderer.getSize( size );
						mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
						mouse.y = -( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

					}

				}
				if ( event.buttons != 1 )
					return;

				render();

			}
			function onObjectMouseDown( position, intersection ) {

				if ( ( options.axesHelper !== undefined ) && ( intersection.object.type === "Points" ) )
					options.axesHelper.exposePosition( position );
				else alert( 'You are clicked the "' + intersection.object.type + '" type object.'
					+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
					+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

				if ( typeof gui !== 'undefined' )
					console.warn( 'qqq' );

			}
			function onDocumentMouseDown( event ) {

				if ( typeof raycaster === 'undefined' )
					return;

				if ( mouseenter )
					return;

				if ( raycaster.stereo !== undefined ) {

					raycaster.stereo.onDocumentMouseDown( event );
					return;

				}
				raycaster.setFromCamera( mouse, camera );
				intersects = raycaster.intersectObjects( group.children );
				if ( intersects.length > 0 ) {

					var intersection = intersects[0],
						position = getPosition( intersection );
					onObjectMouseDown( position, intersection );

				}

			}
			function animate() {

				if ( stats !== undefined )
					stats.begin();

				requestId = requestAnimationFrame( animate );

				render();

				if ( stats !== undefined )
					stats.end();

			}
			function render() {

				if ( typeof stereoEffect === 'undefined' )
					renderer.render( scene, camera );
				else stereoEffect.render( scene, camera );
				if ( cameraPosition === undefined )
					cameraPosition = new THREE.Vector3();
				if ( pointSize === undefined )
					pointSize = options.point.size;
				if (
					!cameraPosition.equals( camera.position ) ||
					( pointSize != options.point.size ) ||
					( ( options.frustumPoints !== undefined ) && options.frustumPoints.animate() )
				) {

					cameraPosition.copy( camera.position );
					pointSize = options.point.size;

					group.children.forEach( function ( mesh ) {

						if ( mesh instanceof THREE.Points === false )
							return;

						if ( mesh.geometry.attributes.size === undefined ) {

							mesh.material.size = pointSize / options.point.sizePointsMaterial;
							return;

						}
						if ( options.point.opacity !== undefined )
							mesh.material.uniforms.opacity.value = options.point.opacity;

						//scale
						var scale = myPoints.getGlobalScale( mesh );
						var cameraPosition = new THREE.Vector3( camera.position.x / scale.x, camera.position.y / scale.y, camera.position.z / scale.z );
						scale = ( scale.x + scale.y + scale.z ) / 3;

						//set size of points with ShaderMaterial
						//https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
						//Example https://threejs.org/examples/?q=points#webgl_custom_attributes_points2

						//points with ShaderMaterial
						for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

							var position = getObjectPosition( mesh, i ),//getObjectLocalPosition( mesh, i ),
								position3d = new THREE.Vector3( position.x, position.y, position.z ),
								distance = position3d.distanceTo( cameraPosition ),
								y = 1;
							//дальние точки очень маленькие
							//	angle = cameraPosition.angleTo( position3d ),
							//	cameraFov = ( Math.PI / 180 ) * 0.5 * camera.fov,
							//	y = 1 - 0.4 * ( angle / cameraFov );

							mesh.geometry.attributes.size.setX( i, Math.tan(

								mesh.userData.shaderMaterial.point !== undefined &&
									mesh.userData.shaderMaterial.point.size !== undefined ?
									mesh.userData.shaderMaterial.point.size : options.point.size

							) * distance * scale * y );
							mesh.geometry.attributes.size.needsUpdate = true;

						}


					} );

				}
				if ( options.guiSelectPoint && options.guiSelectPoint.render )
					options.guiSelectPoint.render();

			}

			//		var timeoutControls;

			arrayCreates.shift();
			var params = arrayCreates.shift();
			if ( params === undefined )
				return;
			myThreejs.create( params.createXDobjects, params.options );

		}

		var optionsStyle = {

			tag: 'style',

		}

		if ( options.dat !== undefined ) {

			loadScript.sync( currentScriptPath + '/../DropdownMenu/styles/gui.css', optionsStyle );

			//for .container class
			loadScript.sync( currentScriptPath + '/../DropdownMenu/styles/menu.css', optionsStyle );

		}

		/**
		 * Save scale, position and rotation to the userData.default of the mesh
		 * @param {any} mesh
		 */
		options.saveMeshDefault = function ( mesh ) {

			mesh.userData.default = mesh.userData.default || {};

			mesh.userData.default.scale = new THREE.Vector3();
			mesh.userData.default.scale.copy( mesh.scale );

			mesh.userData.default.position = new THREE.Vector3();
			mesh.userData.default.position.copy( mesh.position );

			mesh.userData.default.rotation = new THREE.Euler();
			mesh.userData.default.rotation.copy( mesh.rotation );

		}
		options.getPoints = Player.getPoints;
		options.getColors = Player.getColors;
		options.getItemSize = Player.getItemSize;

		//for Raycaster https://threejs.org/docs/index.html#api/en/core/Raycaster
		options.raycaster = {

			/**
			 * Displays a sprite text if you move mouse over an 3D object
			 * @param {object} intersection. See https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
			 * @param {THREE.Scene} scene.
			 * @param {THREE.Vector2} mouse mouse position.
			*/
			onIntersection: function ( intersection, mouse ) {

				if ( intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo() )
					return;
				var spriteTextIntersection = findSpriteTextIntersection( scene );
				if ( spriteTextIntersection === undefined ) {


					const rect = options.spriteText.rect ? JSON.parse( JSON.stringify( options.spriteText.rect ) ) : {};
					rect.displayRect = true;
					rect.backgroundColor = 'rgba(0, 0, 0, 1)';
					spriteTextIntersection = StereoEffect.getTextIntersection( intersection, {

						scales: options.scales,
						spriteOptions: {

							textHeight: options.spriteText.textHeight,
							fontColor: options.spriteText.fontColor,
							rect: rect,
							group: scene,
							center: {

								camera: camera,
								canvas: canvas,

							}

						}

					} );
					spriteTextIntersection.name = spriteTextIntersectionName;
					spriteTextIntersection.scale.divide( scene.scale );
					scene.add( spriteTextIntersection );

				} else spriteTextIntersection.position.copy( pos );
				
				options.renderer.domElement.style.cursor = 'pointer';

			},

			/**
			 * Hides a sprite text if you move mouse out an object
			 * @param {THREE.Scene} scene.
			 */
			//options.removeSpriteTextIntersection = function () 
			onIntersectionOut: function () {

				var detected = false;
				do {

					var spriteTextIntersection = findSpriteTextIntersection( scene );
					if ( spriteTextIntersection !== undefined ) {

						scene.remove( spriteTextIntersection );
						if ( detected )
							console.error( 'Duplicate spriteTextIntersection' );
						detected = true;

					}

				} while ( spriteTextIntersection !== undefined )

				options.renderer.domElement.style.cursor = options.cursor;

			}

		}
		onloadScripts();

	}

}

//Localization

const lang = {

	defaultButton: 'Default',
	defaultTitle: 'Restore Orbit controls settings.',

	settings: 'Settings',
	webglcontextlost: 'The user agent has detected that the drawing buffer associated with a WebGLRenderingContext object has been lost.',

	light: 'Light',
	displayLight: 'Display',
	displayLightTitle: 'Display or hide the light source.',
	restoreLightTitle: 'Restore position of the light source',

//	pointSettings: 'Point',
/*
	size: 'Size',
	sizeTitle: 'Size of the point with "ShaderMaterial" material',

	defaultPointTitle: 'Restore point.',
*/
	opacity: 'Opacity',

};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang.defaultButton = 'Восстановить';
		lang.defaultTitle = 'Восстановить положение осей координат по умолчанию.';

		lang.name = 'Имя';
		lang.settings = 'Настройки';
		lang.webglcontextlost = 'Пользовательский агент обнаружил, что буфер рисунка, связанный с объектом WebGLRenderingContext, потерян.';

		lang.light = 'Свет';
		lang.displayLight = 'Показать';
		lang.displayLightTitle = 'Показать или скрыть источник света.';
		lang.restoreLightTitle = 'Восстановить положение источника света';

//		lang.pointSettings = 'Точка';
/*
		lang.size = 'Размер';
		lang.sizeTitle = 'Размер точки с материалом типа "ShaderMaterial"';

		lang.defaultPointTitle = 'Восстановить точку';
*/
		lang.opacity = 'Непрозрачность';
		break;

}

var spriteTextIntersectionName = 'spriteTextIntersection';
function findSpriteTextIntersection( scene ) {

	var spriteTextIntersection;
	scene.children.forEach( function ( item ) {

		if ( ( item.type === "Sprite" ) && ( item.name === spriteTextIntersectionName ) ) {

			spriteTextIntersection = item;
			return;

		}

	} );
	return spriteTextIntersection;

}

/** @namespace
 * @description Displaying points
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 * if arrayFuncs.length === 0 then push new THREE.Vector3().
 * 
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   name: point name
 *   trace: true - Displays the trace of the point movement. Default is false
 *   cameraTarget: {} Camera look at selected point. See <a href="../../player/jsdoc/module-Player.html#~Player.cameraTarget.init" target="_blank">Player.cameraTarget.init</a>.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 * 
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} options see <a href="module-MyThree-MyThree.html#MyThree" target="_blank">MyThree</a> <b>options</b> for details
 * @param {object} [pointsOptions] followed points options is availablee:
 * @param {number} [pointsOptions.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {string} [pointsOptions.name] Name of the points. Used for displaying of items of the Select drop down control of the Meshes folder of the dat.gui. Default is "".
 * @param {object} [pointsOptions.shaderMaterial] {} - creates the THREE.Points with THREE.ShaderMaterial material.
 * <pre>
 * The size of the each point of the THREE.Points seems the same on canvas
 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
 * </pre>
 * @param {THREE.Vector3} [pointsOptions.position] position of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * <pre>
 * Vector's x, y, z is position of the points.
 * Can be as:
 * float - position of the points.
 * [float] - array of positions of the points.
 * Function - position of the points is function of the t. Example: new Function( 't', 'return 0.1 + t' )
 * </pre>
 * @param {THREE.Vector3} [pointsOptions.scale] scale of the points. Default is new THREE.Vector3( 1, 1, 1 ).
 * <pre>
 * Vector's x, y, z is scale of the points.
 * Can be as:
 * float - scale of the points.
 * [float] - array of scales of the points.
 * Function - scale of the points is function of the t. Example: new Function( 't', 'return 1.1 + t' )
 * </pre>
 * @param {THREE.Vector3} [pointsOptions.rotation] rotation of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * <pre>
 * Vector's x, y, z is rotation of the points.
 * Can be as:
 * float - rotation of the points.
 * [float] - array of rotations of the points.
 * Function - rotation of the points is function of the t. Example: new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )
 * </pre>
 * @param {boolean} [pointsOptions.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details. Default is undefined.
 */
MyThree.points = function ( arrayFuncs, group, options, pointsOptions ) {

	MyPoints( arrayFuncs, group, { options: options, pointsOptions: pointsOptions } );

}
/** @namespace */
MyThree.StereoEffect = {

	/**
	 * Enumeration of available stereo modes.
	 * @see <a href="../../StereoEffect/jsdoc/module-StereoEffect.html#~spatialMultiplexsIndexs" target="_blank">StereoEffect.spatialMultiplexsIndexs</a> for details.
	 * @inner
	 */
	spatialMultiplexsIndexs: StereoEffect.spatialMultiplexsIndexs,

}
/** @namespace
 * @description Pure JavaScript color picker.
 * @see <a href="../../colorpicker/jsdoc/index.html" target="_blank">ColorPicker</a>.
 */
MyThree.ColorPicker = ColorPicker;

/** @namespace
 * @description gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} pos local position
 * @returns world position
 * @see <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html#~getWorldPosition" target="_blank">getWorldPosition</a>.
 */
MyThree.getWorldPosition = getWorldPosition;

/** @namespace
 * @description Limits angles of rotations of the mesh between 0 and 360 degrees.
 * @param {THREE.Euler} rotation angles for limitation
 */
MyThree.limitAngles = function ( rotation ) {

	function limitAngle( axisName ) {

		while ( rotation[axisName] > Math.PI * 2 )
			rotation[axisName] -= Math.PI * 2

	}
	limitAngle( 'x' );
	limitAngle( 'y' );
	limitAngle( 'z' );

}

/* * @namespace
 * @description Array of my points.
 * @see <a href="../../MyPoints/jsdoc/index.html" target="_blank">MyPoints</a>.
 */
//MyThree.MyPoints = MyPoints;

/** @namespace
 * @description Array of points, statically fixed in front of the camera.
 * @see <a href="../../FrustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a>.
 */
MyThree.FrustumPoints = FrustumPoints;

export default MyThree;
