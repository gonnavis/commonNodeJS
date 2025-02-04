/**
 * frustumPoints
 * 
 * Array of points, statically fixed in front of the camera.
 * I use frustumPoints for displaying of the clouds around points.
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

//import MyThree from '../myThree/myThree.js';
import MyPoints from '../myPoints/myPoints.js';

import clearThree from '../clearThree.js';
//import { dat } from '../dat/dat.module.js';

import { getWorldPosition } from '../getPosition.js';

import three from '../three.js'
import FolderPoint from '../folderPoint.js'

//memory limit
//import roughSizeOfObject from '../../commonNodeJS/master/SizeOfObject.js';

import Options from '../Options.js'

var debug = {

	notHiddingFrustumPoints: true, //Точки не скрываются когда пересчитываются их координаты когда пользователь поворачивает сцену
	//notMoveFrustumPoints: true,//Точки двигаются относительно камеры вместе с остальными 3D объектами когда пользователь поворачивает сцену
	//linesiInMono: true,//Возможность показать линии в отсутсвии стерео режима

};
//Standard normal distributionю. Нормальное распределение
//https://en.wikipedia.org/wiki/Normal_distribution
function getStandardNormalDistribution( x ) {

	const standardDeviation = 0.1;//чем больше среднеквадратическое отклонение, тем шире пик нормального распределения
	const res = Math.exp( -0.5 * x * x / ( standardDeviation * standardDeviation ) );// / Math.sqrt( 2 * Math.PI );
	//console.warn( 'x = ' + x + ' y = ' + res );
	return res;

}

class FrustumPoints
{
	/**
	 * Create a `FrustumPoints` instance.
	 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {THREE.Group} group [group]{@link https://threejs.org/docs/index.html?q=Gro#api/en/objects/Group} of objects to which a new FrustumPoints will be added
	 * @param {DOM} canvas The Graphics [Canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} element to draw graphics and animations.
	 * @param {object} [settings={}] the following settings are available
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean|OrbitControls} [settings.options.orbitControls] <pre>false - do not add the [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Allow the camera to orbit around a target.
	 * Or <b>OrbitControls</b> instance.
	 * </pre>
	 * @param {object} [settings.options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * See <b>options.dat</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [settings.options.scales] axes scales.
	 * See <b>options.scales</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean|GuiSelectPoint} [settings.options.guiSelectPoint] <pre>false - do not displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
	 * Or <b>GuiSelectPoint</b> instance.
	 * </pre>
	 * @param {object} [settings.options.raycaster] for [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}.
	 * @param {MyThree.ColorPicker.palette|boolean|number} [settings.options.palette] Points сolor.
	 * See <b>options.palette</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Function|string} [settings.options.getLanguageCode=language code of your browser] Your custom <b>getLanguageCode()</b> function or language code string.
	 * See <b>options.getLanguageCode</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean|AxesHelper} [settings.options.axesHelper] <pre>false - do not add the <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * Or <b>AxesHelper</b> instance.
	 * </pre>
	 * @param {object} [settings.options.frustumPoints] <b>FrustumPoints</b> options. undefined - do not create a <b>FrustumPoints</b> instance.
	 * @param {object} [settings.options.frustumPoints.point={}] points options.
	 * @param {number} [settings.options.frustumPoints.point.size=0] Size of each frustum point.
	 * @param {boolean} [settings.options.frustumPoints.display=true] true - display frustum points.
	 * @param {boolean} [settings.options.frustumPoints.info=false] true - display information about frustum point if user move mouse over or click this point.
	 *
	 * @param {object} [settings.options.frustumPoints.stereo] stereo mode options
	 * @param {number} [settings.options.frustumPoints.stereo.hide=0] Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.
	 * @param {number} [settings.options.frustumPoints.stereo.opacity=0.3] Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 *
	 * @param {number} [settings.options.frustumPoints.zCount=50] The count of layers of the frustum of the camera's field of view.
	 * @param {number} [settings.options.frustumPoints.yCount=30] The count of vertical points for each z level of the  frustum of the camera's field of view.
	 *
	 * @param {number} [settings.options.frustumPoints.near=0] Shift of the frustum layer near to the camera in percents.
	 * <pre>
	 * 0 percents - no shift.
	 * 100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды.
	 * </pre>
	 * @param {number} [settings.options.frustumPoints.far=0] Shift of the frustum layer far to the camera in percents.
	 * <pre>
	 * 0 percents - no shift.
	 * 100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды.
	 * </pre>
	 * @param {number} [settings.options.frustumPoints.base=100] Scale of the base of the frustum points in percents.
	 * <pre>
	 * 0 base is null
	 * 100 no scale
	 * </pre>
	 * @param {boolean} [settings.options.frustumPoints.square=false] true - Square base of the frustum points.
	 */
	constructor( camera, group, canvas, settings = {} ) {

		//Непонятно почему frustumPoints не видны если убрать эту команду
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		canvas.getContext( 'webgl' );

		settings.options = settings.options || new Options();
		const options = settings.options;
		if ( !options.boOptions ) {

			console.error( 'FrustumPoints: call options = new Options( options ) first' );
			return;

		}
		if ( !options.frustumPoints ) return;

		this.getOptions = function () { return options; }
		const optionsShaderMaterial = options.frustumPoints;
		options.frustumPoints = this;
		const THREE = three.THREE;

		const _arrayCloud = []//Массив координат точек, имеющих облако вокруг себя
							//координаты точек сгруппированы в группы отдельно для каждого THREE.Points
		var _guiSelectPoint, _names, _points;
		_arrayCloud.getCloudsCount = function () {

			var count = 0;
			for ( var i = 0; i < _arrayCloud.length; i++ ) {

				var arrayVectors = _arrayCloud[i];
				count += arrayVectors.length;

			}
			return count;

		}

		/**
		 * Pushes to clouds array all points from <b>geometry.attributes.position</b>
		 * @param {THREE.BufferGeometry|THREE.Points} geometry [THREE.BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry}
		 * or [THREE.Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points}
		 * @returns index of the new array item
		 */
		this.pushArrayCloud = function ( geometry ) {

			var points;
			if ( geometry.geometry ) {

				points = geometry;
				geometry = geometry.geometry;

			}
			if ( geometry.attributes.position.itemSize !== 4 ) {

				console.error( 'FrustumPoints.pushArrayCloud: Invalid geometry.attributes.position.itemSize = ' + geometry.attributes.position.itemSize );
				return;
				
			}

			//Массив точек, имеющих облако _arrayCloud, разбил на группы points
			//В каждой группе points содержатся все точки, из одного mesh
			//Это сделал потому что если одновременно имеются точки с 
			// shaderMaterial и без shaderMaterial, то порядок добавления точек в _arrayCloud
			// Не совпадает с порядком расположения mesh в group
			// потому что точки без shaderMaterial добавляются сразу после создания
			// а точки с shaderMaterial добаляются только после вызова loadShaderText в function getShaderMaterialPoints
			const index = _arrayCloud.getCloudsCount(),
				arrayPoints = [];
			_arrayCloud.push( arrayPoints );
			for ( var i = 0; i < geometry.attributes.position.count; i++ ) {

				const point = new THREE.Vector4().fromArray( geometry.attributes.position.array, i * geometry.attributes.position.itemSize );

				//Здесь коррекитровка point.w не имеет эффекта. Она коррекитруется в FrustumPoints.cloud.updateMesh
//				point.w *= options.scales.w.max;

				arrayPoints.push( point );

			}
			if ( points ) points.userData.cloud = { indexArray: index, }
			return index;

		}

		/** create points
		 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
		 */
		this.create = function ( renderer ) {

			//если нет точек с облаком, то облако нужно создавать что бы его было видно в guiSelectPoint
			//однако в этом случае в консоли появятся сообщения:
			//
			//warning X3557: loop only executes for 0 iteration(s), consider removing [loop]
			//warning X3557: loop doesn't seem to do anything, consider removing [loop]
			//WebGL: INVALID_OPERATION: texImage2D: ArrayBufferView not big enough for request
			//
			//Это означает что из D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
			//нужно удалить цикл
			//for ( float i = 0.; i < cloudPointsWidth; i++ )
			//
			if ( _arrayCloud.length === 0 )
				return undefined;//нет точек с облаком. Поэтому нет смысла создавать frustumPoints

/*			
			//После того как появился class OrbitControls extends EventDispatcher я вынужден динамически асинхронно подкачивать 
			//файл OrbitControls.js. Смотри Options.createOrbitControls
			//Поэтому к данному моменту options.orbitControls еще undefined
			if ( options.orbitControls )
				options.orbitControls.addEventListener( 'change', function () { _this.onChangeControls(); } );
*/				

			const shaderMaterial = {}, zeroPoint = new THREE.Vector3(), cameraDistanceDefault = camera.position.distanceTo( zeroPoint ), _this = this,// lines = []
				groupFrustumPoints = new THREE.Group();

			settings.optionsShaderMaterial = settings.optionsShaderMaterial || {};

			optionsShaderMaterial.point = optionsShaderMaterial.point || {};
			optionsShaderMaterial.point.size = optionsShaderMaterial.point.size || 0.01;//Size of each frustum point

			optionsShaderMaterial.display = optionsShaderMaterial.display === undefined ? true : optionsShaderMaterial.display;//true - display frustum points
			optionsShaderMaterial.info = optionsShaderMaterial.info !== undefined ? optionsShaderMaterial.info : false;//true - display information about frustum point if user move mouse over or click this point.

			//Stereo
			optionsShaderMaterial.stereo = optionsShaderMaterial.stereo || {};
			optionsShaderMaterial.stereo.hide = optionsShaderMaterial.stereo.hide || 0;//Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.
			optionsShaderMaterial.stereo.opacity = optionsShaderMaterial.stereo.opacity || 0.3;//Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.'

			optionsShaderMaterial.zCount = optionsShaderMaterial.zCount || 50;//The count of layers of the frustum of the camera's field of view.
			optionsShaderMaterial.yCount = optionsShaderMaterial.yCount || 30;//The count of vertical points for each z level of the  frustum of the camera's field of view.

			//изменение размеров усеченной пирамиды FrustumPoints

			optionsShaderMaterial.near = optionsShaderMaterial.near || 0;//Shift of the frustum layer near to the camera in percents.
			//0 percents - no shift.
			//100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды
			optionsShaderMaterial.far = optionsShaderMaterial.far || 0;//Shift of the frustum layer far to the camera in percents.
			//0 percents - no shift.
			//100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды
			optionsShaderMaterial.base = optionsShaderMaterial.base || 100;//Scale of the base of the frustum points in percents.
			//0 base is null
			//100 no scale
			optionsShaderMaterial.square = optionsShaderMaterial.square !== undefined ? optionsShaderMaterial.square : false; //true - Square base of the frustum points.

			const cookie = options.dat.cookie,
				cookieName = options.dat ? options.dat.getCookieName( 'FrustumPoints' ) : 'FrustumPoints';

			Object.freeze( optionsShaderMaterial );
			if ( cookie ) cookie.getObject( cookieName, shaderMaterial, optionsShaderMaterial );

			//оставить shaderMaterial.stereo по умолчанию потому что сейчас lines не использую
			//и возможно в cookie сохранились зачения shaderMaterial.stereo от старых версий этой программы
			//		shaderMaterial.stereo.lines = optionsShaderMaterial.stereo.lines;
			if ( shaderMaterial.stereo ) {

				shaderMaterial.stereo.hide = optionsShaderMaterial.stereo.hide;
				shaderMaterial.stereo.opacity = optionsShaderMaterial.stereo.opacity;

			}

			var cloud = function () {

				var uniforms;
				var distanceTableWidth;//distanceTable points count
				this.create = function ( _uniforms ) {

					uniforms = _uniforms;

					//индекс палитры надо пересчитывать в зависимости от min and max key of the options.scales.w
					//В D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
					//сначала вычисляется paletteIndex,
					//который равен сумме индексов цветов всех точек cloudPoint.w 
					//помноженное на растояние fDistance от точки имеющей облако до текущей точки frustumPoint.
					//Индексы cloudPoint.w находятся в диапазоне min and max key of the options.scales.w
					//paletteIndex это координата x в палитре palette в D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
					//которая имеет тип sampler2D https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Sampler_types
					//которая имеет текстуру 2D texture.
					//Диапазон paletteIndex должен быть в предплах от 0 до 1 https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
					//Получаем пропорции:
					//Если w = options.scales.w.min то paletteIndex = 0.
					//Если w = options.scales.w.max то paletteIndex = 1.
					if ( !options.scales.w ) options.scales.setW();
					const max = options.scales.w.max, min = options.scales.w.min;
					//w = ( w - min ) / ( max - min ) = w / ( max - min ) - min / ( max - min ) = w / (1+1) + 1 / (1+1) = w * 0.5 + 0.5 ;
					uniforms.paletteA = { value: 1 / ( max - min ) };//0.5 };
					uniforms.paletteB = { value: - min / ( max - min ) };//0.5 };

					//array of all points with cloud
					this.cloudPoints = new this.addUniforms( THREE.RGBAFormat, _arrayCloud.getCloudsCount(), 'cloudPoints' );

					//function of distance between points. Use for creating of the cloud around point
					//distanceTable is THREE.DataTexture
					//	width = distanceTableWidth( distanceTable points count )
					//	height = 2
					//THREE.DataTexture contains two lines:
					//	Every line have x from 0 to width - 1
					//	First line (y = 0) is function of distance
					//	Second line (y = 1) is distance from cloud point to frustum point
					//Такая структура distanceTable позволяет неравномерно распределять точки по дистанции
					//Если function of distance меняется быстро, то надо наставить побольше точек
					//Если function of distance почти не меняется, точек можно поставить поменьше
					//Это позволит поставить последнюю точку на достаточно большой дистанции
					//и таким образом можно учитывать малое влияние облака на большом расстоянии.
					distanceTableWidth = 256;//distanceTable points count
					const pointLength = 2;//Every point contains two coordinates
					new this.addUniforms( THREE.LuminanceFormat,//RGFormat,//RGBFormat,
						distanceTableWidth, 'distanceTable', {

						height: pointLength,
						onReady: function ( data, itemSize, updateItem ) {

							//debug
							//var linePoints = [];
							////////////////////////////
							var fDistancePrev, x = 0;
							const dDistanceMax = 0.035;
							var dx = 0.5 / ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.00196078431372549
							//ddx	xmax
							//1.001	0.5686435272529023 y = 9.515363374066325e-8
							//var dx = 1.5 / ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.0058823529411764705
							//ddx	xmax
							//1.001	1.686899158126089 y = 1.614196454247848e-62
							//1.01	5.688013140820184
							//1.05	11783.008823594038
							//1.1	285390429.9744771
							//var dx = 2/ ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.00784313725490196
							//ddx	xmax
							//1.001	2.2149519380160148 y = 2.932926014021469e-107
							//1.01	7.0082200110085715
							//1.05	12925.219146819716
							//1.1	314479812.6420277
							//var dx = 20/ ( distanceTableWidth - 1 ); const ddx = 1.1;
							//dx = 0.0784313725490196
							//ddx	xmax
							//1.001	22.56677751344284 y = 0
							//1.1	11942365647.747343 y = 0
							for ( var i = 0; i < distanceTableWidth; i++ ) {

								var fDistance = getStandardNormalDistribution( x );
								//console.warn( 'dx = ' + dx );
								x += dx;
								if ( fDistancePrev !== undefined ) {

									if ( Math.abs( fDistancePrev - fDistance ) > dDistanceMax )
										dx /= ddx;
									else dx *= ddx;

								}
								fDistancePrev = fDistance;

								updateItem( i, fDistance );//function of distance
								updateItem( i + distanceTableWidth, x );//distance from cloud point to frustum point

								//debug
								//if ( linePoints !== undefined )
								//	linePoints.push( new THREE.Vector3( x, fDistance, 0 ) );
								////////////////////////////

							}

							//debug
							/*
							if ( linePoints !== undefined ) {

								//group.add( new THREE.Line( new THREE.BufferGeometry().setFromPoints( linePoints ), new THREE.LineBasicMaterial( {
								//	color: 0x0000ff
								//} ) ) );
								group.add( new THREE.Points( new THREE.BufferGeometry().setFromPoints( linePoints ),
									new THREE.PointsMaterial( { color: 0xffffff, alphaTest: 0.5 } ) ) );

							}
							*/
							////////////////////////////

						}

					} );

				}
				this.addUniforms = function ( format, width, key, optionsAddUniforms ) {

					optionsAddUniforms = optionsAddUniforms || {};
					//format = RGBAFormat,//LuminanceFormat,//Available formats https://threejs.org/docs/index.html#api/en/constants/Textures
					//D:\My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\src\constants.js
					const itemSize = format === THREE.RGBAFormat ? 4 : format === THREE.RGBFormat ? 3 : format === THREE.LuminanceFormat ? 1 : NaN;
					const height = optionsAddUniforms.height || 1,//format === THREE.LuminanceFormat ? 1 : 2,
						size = width * height,
						type = THREE.FloatType,
						data = type === THREE.FloatType ? new Float32Array( itemSize * size ) : new Uint8Array( itemSize * size );
					/*Uncaught TypeError: Right-hand side of 'instanceof' is not callable
					if( !this instanceof cloud )
						console.error('');
					*/
					if ( this.addUniforms !== undefined )
						console.error( 'Please use "new this.addUniforms(...)"' );
					this.updateItem = function ( i, vector ) {

						var x, y, z, w;
						if ( typeof vector === "number" )
							x = vector;
						else if ( vector.x === undefined ) {

							x = vector.r;
							y = vector.g;
							z = vector.b;

						} else {

							x = vector.x;
							y = vector.y;
							z = vector.z;
							if ( isNaN( vector.w ) )
								console.error( 'frustumPoints.create.cloud.addUniforms.updateItem: vector.w = ' + vector.w + '. Probably you use THREE.Color for w coordinate of the point with cloud.' );

							/*
							//w это координата x в палитре palette в D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
							//которая имеет тип sampler2D https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Sampler_types
							//которая имеет текстуру 2D texture.
							//Диапазон w должен быть в предплах от 0 до 1 https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
							//Получаем пропорции:
							//Если vector.w = options.scales.w.min то w = 0.
							//Если vector.w = options.scales.w.max то w = 1.
							const max = options.scales.w.max, min = options.scales.w.min;
							w = ( vector.w - min ) / ( max - min );
							*/
							w = vector.w;

						}
						const vectorSize = y === undefined ? 1 : z === undefined ? 2 : w === undefined ? 3 : 4,
							stride = i * itemSize;
						if ( vectorSize !== itemSize )
							console.error( 'frustumPoints.create.cloud.addUniforms.updateItem: vectorSize = ' + vectorSize + ' !== itemSize = ' + itemSize );
						data[stride] = x;
						if ( itemSize > 1 ) {

							data[stride + 1] = y;
							if ( itemSize > 2 ) {

								data[stride + 2] = z;
								if ( itemSize > 3 )
									data[stride + 3] = w;

							}

						}

					}

					if ( optionsAddUniforms.onReady !== undefined )
						optionsAddUniforms.onReady( data, itemSize, this.updateItem );

					uniforms[key] = {

						value: new THREE.DataTexture( data,
							width, height, format, type )

					};
					uniforms[key].value.needsUpdate = true;

					return itemSize;

				}
				this.editShaderText = function ( shaderText ) {

					var scloudPointsWidth = 0;
					for ( var i = 0; i < _arrayCloud.length; i++ ) {

						var arrayVectors = _arrayCloud[i];
						scloudPointsWidth += arrayVectors.length;

					}
					shaderText.vertex = shaderText.vertex.replace( '%scloudPointsWidth', scloudPointsWidth + '.' );
					shaderText.vertex = shaderText.vertex.replace( '%distanceTableWidth', distanceTableWidth + '.' );

				}
				this.updateMesh = function ( mesh ) {

					if (
						( mesh.userData.cloud === undefined )
						|| !this.cloudPoints//Пользователь убрал галочку в 'Display' - 'Display or hide Frustum Points.'
					)
						return;
					for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

						const point = new THREE.Vector4().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize );
						this.cloudPoints.updateItem( mesh.userData.cloud.indexArray + i, getWorldPosition( mesh, point ) );

					}

				}

			};
			cloud = new cloud();
			group.add( groupFrustumPoints );

			function setPointsParams() {

				function set() {

					if ( !_points )
						return;
					_points.position.copy( camera.position );
					_points.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
					var scale = camera.position.distanceTo( zeroPoint ) / cameraDistanceDefault;
					_points.scale.x = scale;
					_points.scale.y = scale;
					_points.scale.z = scale;

				}
				set();
				/*
				console.warn( '_points.position: ' + _points.position.x + ' ' + _points.position.y + ' ' + _points.position.z +
				' _points.scale: ' + _points.scale.x + ' ' + _points.scale.y + ' ' + _points.scale.z +
				' _points.rotation: ' + _points.rotation.x + ' ' + _points.rotation.y + ' ' + _points.rotation.z );
				*/
				if ( options.guiSelectPoint ) options.guiSelectPoint.setMesh();

			}
			function update( onReady ) {

				if ( _points === undefined ) {

					progress( onReady );

				}

			}
			/**
			 * The user has moved the camera
			 * @event
			 * */
			this.onChangeControls = function () {

				if ( !debug.notHiddingFrustumPoints ) {

					//Updating of the canvas is too slow if FrustumPoints count is very big (about 'Z Count' = 50 and 'Y Count' = 30).
					//I am hidding all points during  changing of the contdrol and show it again after 500 msec for resolving of the problem.
					if ( timeoutControls === undefined ) {

						group.remove( _points );
						group.remove( groupFrustumPoints );
						options.raycaster.removeParticle( _points );

					}
					clearTimeout( timeoutControls );
					timeoutControls = setTimeout( function () {

						group.add( groupFrustumPoints );
						if ( shaderMaterial.info )
							options.raycaster.addParticle( _points );

						clearTimeout( timeoutControls );
						timeoutControls = undefined;

						if ( !debug.notMoveFrustumPoints ) {

							_this.update();

						}

					}, 500 );

				} else if ( !debug.notMoveFrustumPoints ) {

					_this.update();

				}

			}
			function progress( onReady ) {

				if ( !shaderMaterial.display )
					return;

				const cameraPerspectiveHelper = new THREE.CameraHelper( camera );

				var array, indexArray = 0;

				function getPoint( pointName ) {

					var points = cameraPerspectiveHelper.pointMap[pointName],
						position = cameraPerspectiveHelper.geometry.attributes.position;
					return new THREE.Vector3().fromArray( position.array, points[0] * position.itemSize )

				}

				//near точки ближней к камере плоскости усеченной пирамиды
				const point_n1 = getPoint( 'n1' ),
					point_n2 = getPoint( 'n2' ),
					point_n3 = getPoint( 'n3' );

				//far точки основания пирамиды

				const point_f1 = getPoint( 'f1' ),
					point_f2 = getPoint( 'f2' ),
					point_f3 = getPoint( 'f3' );

				//изменение размеров усеченной пирамиды FrustumPoints

				//Scale of the base of the frustum points.
				point_n1.x = ( point_n1.x * shaderMaterial.base ) / 100;
				point_n2.x = ( point_n2.x * shaderMaterial.base ) / 100;
				point_n3.x = ( point_n3.x * shaderMaterial.base ) / 100;
				point_n1.y = ( point_n1.y * shaderMaterial.base ) / 100;
				point_n2.y = ( point_n2.y * shaderMaterial.base ) / 100;
				point_n3.y = ( point_n3.y * shaderMaterial.base ) / 100;
				point_f1.x = ( point_f1.x * shaderMaterial.base ) / 100;
				point_f2.x = ( point_f2.x * shaderMaterial.base ) / 100;
				point_f3.x = ( point_f3.x * shaderMaterial.base ) / 100;
				point_f1.y = ( point_f1.y * shaderMaterial.base ) / 100;
				point_f2.y = ( point_f2.y * shaderMaterial.base ) / 100;
				point_f3.y = ( point_f3.y * shaderMaterial.base ) / 100;

				//Square base of the frustum points.
				if ( shaderMaterial.square ) {

					point_n1.x /= camera.aspect;
					point_n2.x /= camera.aspect;
					point_n3.x /= camera.aspect;
					point_f1.x /= camera.aspect;
					point_f2.x /= camera.aspect;
					point_f3.x /= camera.aspect;

				}

				const pointn1x = point_n1.x, pointn2x = point_n2.x, pointn3x = point_n3.x,
					pointn1y = point_n1.y, pointn2y = point_n2.y, pointn3y = point_n3.y,
					pointn1z = point_n1.z;
				//Shift of the frustum layer near to the camera
				point_n1.x = point_n1.x + ( ( point_f1.x - point_n1.x ) * shaderMaterial.near ) / 100;
				point_n2.x = point_n2.x + ( ( point_f2.x - point_n2.x ) * shaderMaterial.near ) / 100;
				point_n3.x = point_n3.x + ( ( point_f3.x - point_n3.x ) * shaderMaterial.near ) / 100;
				point_n1.y = point_n1.y + ( ( point_f1.y - point_n1.y ) * shaderMaterial.near ) / 100;
				point_n2.y = point_n2.y + ( ( point_f2.y - point_n2.y ) * shaderMaterial.near ) / 100;
				point_n3.y = point_n3.y + ( ( point_f3.y - point_n3.y ) * shaderMaterial.near ) / 100;
				point_n1.z = point_n2.z = point_n3.z = point_n1.z + ( ( point_f1.z - point_n1.z ) * shaderMaterial.near ) / 100;
				//Shift of the frustum layer far to the camera
				point_f1.x = point_f1.x + ( ( pointn1x - point_f1.x ) * shaderMaterial.far ) / 100;
				point_f2.x = point_f2.x + ( ( pointn2x - point_f2.x ) * shaderMaterial.far ) / 100;
				point_f3.x = point_f3.x + ( ( pointn3x - point_f3.x ) * shaderMaterial.far ) / 100;
				point_f1.y = point_f1.y + ( ( pointn1y - point_f1.y ) * shaderMaterial.far ) / 100;
				point_f2.y = point_f2.y + ( ( pointn2y - point_f2.y ) * shaderMaterial.far ) / 100;
				point_f3.y = point_f3.y + ( ( pointn3y - point_f3.y ) * shaderMaterial.far ) / 100;
				point_f1.z = point_f2.z = point_f3.z = point_f1.z + ( ( pointn1z - point_f1.z ) * shaderMaterial.far ) / 100;

				const pointStart = new THREE.Vector3().copy( point_n1 );

				function sqrtInt( value ) {

					const a = parseInt( Math.sqrt( zCount - 1 ) );
					return parseInt( value / a ) * a;

				}
				const zCount = shaderMaterial.zCount,
					zStep = ( point_f1.z - point_n1.z ) / ( ( zCount - 1 ) * ( zCount - 1 ) );

				//смещение по оси x
				var zx = 0;
				const yCount = shaderMaterial.yCount,
					xCount = yCount * ( shaderMaterial.square ? 1 : parseInt( camera.aspect ) );
				var zy = 0;//смещение по оси y

				//You can see the Chrome memory crash if you has set very big shaderMaterial.zCount or  shaderMaterial.yCount. (about 900000).
				//Unfortunately you cannot to catch memory crash. https://stackoverflow.com/questions/44531357/how-to-catch-and-handle-chrome-memory-crash
				//Instead I temporary set shaderMaterial.zCount to default value and restore it after creating of all z levels.
				//Now you can see default shaderMaterial.zCount after memory crash and reloading of the wab page.
				shaderMaterial.zCount = optionsShaderMaterial.zCount;
				shaderMaterial.yCount = optionsShaderMaterial.yCount;

				const zStart = parseInt( ( zCount * shaderMaterial.stereo.hide ) / 100 ),
					zEnd = zStart + zCount - 1;
				function Z( z ) {

					//console.warn( 'z ' + z );
					const ynStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ),
						yfStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 ),
						yStep = ( ( yfStep - ynStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + ynStep,
						sqrtZCount = parseInt( Math.sqrt( zCount ) ),
						yzStep = yStep / ( sqrtZCount + parseInt( Math.sqrt( zCount - ( sqrtZCount * sqrtZCount ) ) ) ),//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга

						xnStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ),
						xfStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
						xStep = ( ( xfStep - xnStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + xnStep,
						xzStep = xStep / parseInt( Math.sqrt( zCount ) );//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
					pointStart.y = - yStep * ( yCount - 1 ) / 2;
					pointStart.x = - xStep * ( xCount - 1 ) / 2;
					for ( var y = 0; y < yCount; y++ ) {

						for ( var x = 0; x < xCount; x++ )
							if ( z >= zStart ) {

								function addPoint( point ) {

									_names.push(

										x === 0 ?
											y === 0 ? { y: y, z: z } : { y: y } :
											x

									);
									array[indexArray] = point.x;
									indexArray++;
									array[indexArray] = point.y;
									indexArray++;
									array[indexArray] = point.z;
									indexArray++;

								}
								addPoint( new THREE.Vector3(

									pointStart.x + xStep * x + xzStep * zx,
									pointStart.y + yStep * y + yzStep * zy,
									pointStart.z + zStep * z * z

								) );

							}

					}
					zx++;
					if ( zx >= parseInt( Math.sqrt( zCount ) ) ) {

						zx = 0;
						zy++;

					}

				}
				function eachZ( zStart, zEnd ) {

					if ( zStart > zEnd )
						return;
					Z( zStart );
					if ( zStart >= zEnd )
						return;
					Z( zEnd );
					var zMid = parseInt( ( zStart + zEnd ) / 2 );
					if ( zMid === zStart )
						return;//for testing set 'Z Count' = 6
					Z( zMid );
					eachZ( zStart + 1, zMid - 1 );
					eachZ( zMid + 1, zEnd - 1 );

				}

				//For Chrome memory crash see above.
				shaderMaterial.zCount = zCount;
				shaderMaterial.yCount = yCount;

				//если оставить эту строку то когда произойдет переполнение памяти, веб страница вечно будет не открываться
				//for testing set 'Z Count' = 100 and 'Y count' = 1000
				//saveSettings();

				removePoints( true );

				const itemSize = 3;
				_this.pointIndexes = function ( pointIndex ) {

					if ( _names === undefined ) {

						console.error( '_names = ' + _names );//сюда попадает в отладочной версии
						return undefined;

					}
					var name = _names[pointIndex], x, y, z, index = pointIndex;
					function getObject() {

						index--;
						while ( ( index >= 0 ) && ( typeof _names[index] !== "object" ) )
							index--;
						name = _names[index];

					}
					function getZ() {

						while ( ( index >= 0 ) && ( name.z === undefined ) )
							getObject();

					}
					if ( typeof name === "object" ) {

						x = 0;
						y = name.y;
						getZ();
						z = name.z;

					} else {

						x = name;
						getObject();
						y = name.y;
						getZ();
						z = name.z;

					}
					return { x: x, y: y, z: z };

				}

				//Thanks to https://stackoverflow.com/a/27369985/5175935
				//Такая же функция есть в myPoints.js но если ее использовать то она будет возвращать путь на myPoints.js
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
				var path = getCurrentScriptPath();
				var cameraPositionDefault = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z );
				var cameraQuaternionDefault = new THREE.Vector4( camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w );

				//сделал это приравниванеие что бы избежать двойного создания массива точек frustumPoints MyThree.MyPoints(...)
				//Если это произойдет, то непонятно почему для каждой точки будет создано два облака
				//Одно облако верное
				//Второе находится строго между точкой и камерой
				//Второе облако можно увидеть если повернуть камеру с помощью orbitControl
				//Сюда попадает по второму разу если вызвать stereoEffect.gui(...)
				_points = false;

				MyPoints( function () {

					var geometry = new THREE.BufferGeometry(),
						geometryLength = ( zEnd - zStart + 1 ) * xCount * yCount;

					array = new Float32Array( geometryLength * itemSize );
					indexArray = 0;
					_names = null;
					_names = [];

					eachZ( zStart, zEnd );

					geometry.setAttribute( 'position', new THREE.BufferAttribute( array, itemSize ) );

					return geometry;

				}, group, {

					options: options,
					pointsOptions: {

						name: 'frustum points',
						shaderMaterial: shaderMaterial,
						boFrustumPoints: true,
						position: camera.position,
						scale: camera.scale,
						rotation: camera.rotation,
						opacity: true,
						pointIndexes: function ( pointIndex ) { return _this.pointIndexes( pointIndex ); },
						path: {

							vertex: path + '/frustumPoints/vertex.c',

						},
						pointName: function ( pointIndex ) {

							var indexes = _this.pointIndexes( pointIndex );
							if ( indexes === undefined )
								return indexes;
							return 'x = ' + indexes.x + ', y = ' + indexes.y + ', z = ' + ( indexes.z + zStart ) + ', i = ' + pointIndex;

						},
						controllers: function () {

							if ( _guiSelectPoint ) _guiSelectPoint.appendChild( { xCount: xCount, yCount: yCount, zCount: zCount, } );

						},
						uniforms: function ( uniforms ) {

							cloud.create( uniforms );

							//rotate the quaternion vector to 180 degrees
							cameraQuaternionDefault.x = - cameraQuaternionDefault.x;
							cameraQuaternionDefault.y = - cameraQuaternionDefault.y;
							cameraQuaternionDefault.z = - cameraQuaternionDefault.z;

							cameraPositionDefault.applyQuaternion( cameraQuaternionDefault );

							uniforms.cameraPositionDefault = { value: cameraPositionDefault };
							uniforms.cameraQuaternion = { value: camera.quaternion };

							//palette
							//ВНИМАНИЕ!!! Для того, что бы палитра передалась в vertex надо добавить 
							//points.material.uniforms.palette.value.needsUpdate = true;
							//в getShaderMaterialPoints.loadShaderText

							new cloud.addUniforms( THREE.RGBFormat, 256, 'palette', {

								onReady: function ( data, itemSize, updateItem ) {

									options.scales.setW();
									const min = options.scales.w.min, max = options.scales.w.max;
									const size = data.length / itemSize;
									for ( var i = 0; i < size; i++ )
										updateItem( i, options.palette.toColor( ( max - min ) * i / ( size - 1 ) + min, min, max ) );

								}

							} );
							return cloud;

						},
						onReady: function ( points ) {

							_points = points;
							_points.userData.isInfo = function () { return shaderMaterial.info; }

							if ( shaderMaterial.info && options.raycaster )
								options.raycaster.addParticle( _points );

							if ( !shaderMaterial.display )
								removePoints();
							pointOpacity = _points === undefined ?
								1.0 :
								_points.userData.shaderMaterial === undefined ? shaderMaterial.point.opacity : _points.userData.shaderMaterial.point.opacity;

							if ( onReady !== undefined )
								onReady();//Пользователь изменил настройки frustumPoints

							//когда задан параметр cameraTarget у MyThree то нужно передвинуть frustumPoints после того как созданы points
							_this.update();

							if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( _points );

						},

					}

				} );

			}
			update();
			var pointOpacity;
			/** Moves frustum points in front of the camera. */
			this.update = function ( onReady ) {

				update( onReady );

				//Эта команда нужна в случае изменения размера окна браузера когда canvas на весь экран
				setPointsParams();

				var cameraQuaternionDefault = new THREE.Vector4( camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w );

				if ( !_points )
					return;//User has changed 'Z Count' of the frustumPoints

				_points.material.uniforms.cameraPositionDefault.value.copy( camera.position );

				//rotate the quaternion vector to 180 degrees
				cameraQuaternionDefault.x = - cameraQuaternionDefault.x;
				cameraQuaternionDefault.y = - cameraQuaternionDefault.y;
				cameraQuaternionDefault.z = - cameraQuaternionDefault.z;

				_points.material.uniforms.cameraPositionDefault.value.applyQuaternion( cameraQuaternionDefault );

			}
			/** 
			 *  @returns true - frustum points is created and visible.
			 *  <p>false - frustum points have been removed.</p>
			 * */
			this.isDisplay = function () { return shaderMaterial.display; }
			/** Updates the cloud's points according new position of the all points of the all meshes
			 * of the group of objects to which a new FrustumPoints has been added. */
			this.updateCloudPoints = function () {

				group.children.forEach( function ( mesh ) {

					if ( !mesh.userData.cloud )
						return;
					if ( mesh.geometry.attributes.position.itemSize !== 4 ) {

						console.error( 'mesh.geometry.attributes.position.itemSize = ' + mesh.geometry.attributes.position.itemSize );
						return;

					}
					cloud.updateMesh( mesh );

				} );
				needsUpdate();

			}
			function needsUpdate() {

				if ( _points )
					_points.material.uniforms.cloudPoints.value.needsUpdate = true;

			}
			/**
			 * 
			 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}
			 */
			this.updateCloudPoint = function ( mesh ) {

				cloud.updateMesh( mesh );
				needsUpdate();

			}
			/**
			 * The user has changed selected point.
			 * @event
			 * @param {THREE.Points} points [Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points}
			 * @param {number} i index of the point from <b>points</b> for udating
			 */
			this.updateCloudPointItem = function ( points, i ) {

				if ( points.userData.cloud === undefined )
					return;
				if ( points.geometry.attributes.position.itemSize !== 4 )
					console.error( 'points.geometry.attributes.position.itemSize = ' + points.geometry.attributes.position.itemSize );
				cloud.cloudPoints.updateItem( points.userData.cloud.indexArray + i,
					getWorldPosition( points,
						new THREE.Vector4().fromArray( points.geometry.attributes.position.array, i * points.geometry.attributes.position.itemSize ) ),
					true );
				needsUpdate();

			}

			//Convert all points with cloud, but not shaderMaterial from local to world positions
			// i.e. calculate scales, positions and rotation of the points.
			//Converting of all points with cloud and shaderMaterial see getShaderMaterialPoints function in the myPoints.js file
			//		this.updateCloudPoints();

			function removePoints( notRemoveMesh ) {

				if ( _points === undefined )
					return;
				if ( !notRemoveMesh && options.guiSelectPoint )
					options.guiSelectPoint.removeMesh( _points );//не удаляю frustumPoints из списка Meshes потому что сюда попадает только если пользователь изменил число точек frustumPoints.
				//В этом случае создается новый frustumPoints, который надо присоеденить к старому frustumPoints из списка Meshes.
				//Если я удалю frustumPoints из списка Meshes а потом добавлю туда новый frustumPoints,
				//то изменится индекс frustumPoints в списке Meshes
				//и тогда неверно будет выполняться function update() в frustumPoints и как результат буде неверный список Ponts списке Meshes
				//for testing
				//Select in the canvas any point, but not frustum point.
				//Now you can see your selected point in the in the Meshes/Points/Select list in the gui.
				//Change Settings/Frustum Points/Z count in the gui.
				//Now your selected point is deselected.
				//Select in the canvas your point again.
				//Now yiou can see "Cannot read property 'selected' of undefined" error message in the console.
				//Try to select your point in the gui. You can not to do it because your point is not exists in the Meshes/Points/Select list. Instead you see all Frustum Points in the Meshs/Points/Select list.

				group.remove( _points );
				renderer.renderLists.dispose();
				clearThree( _points );
				_points = undefined;

			}
			/** Called from animate loop for rendering.
			 * @see {@link https://threejs.org/docs/index.html?q=animate#manual/en/introduction/Creating-a-scene|Rendering the scene}*/
			this.animate = function () {

				if (
					!_points ||
					( _points.userData.shaderMaterial === undefined ) ||
					(
						( pointOpacity === _points.userData.shaderMaterial.point.opacity ) )
				) {

					return false;

				}
				pointOpacity = _points.userData.shaderMaterial.point.opacity;
				_points.material.uniforms.opacity.value = _points.userData.shaderMaterial.point.opacity;
				return true;

			}

			/** update "frustum points" item in the <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a>.*/
			this.updateGuiSelectPoint = function () {


				//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
				//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
				const index = options.guiSelectPoint ? options.guiSelectPoint.getMeshIndex( _points ) : undefined;

				update();

				//затем заменяю указатель на старый points в списке cMeshs на новый.
				if ( index ) options.guiSelectPoint.setIndexMesh( index, _points );

			}

			/**
			* @callback FolderPoint
			* @param {object} folder parent folder
			* @param {function} setSettings save points setting to the cookie
			*/

			/**
			 * Adds FrustumPoints folder into dat.GUI.
			 * See [dat.GUI API]{@link https://github.com/dataarts/dat.gui/blob/master/API.md}.
			 * @param {object} [folder] parent folder
			 */
			this.gui = function ( folder ) {

				const dat = three.dat;//options.dat.dat;

				folder = folder || options.dat.gui;
				if ( !folder || options.dat.guiFrustumPoints === false )
					return;

				//Localization

				const lang = {

					frustumPoints: 'Frustum Points',
					frustumPointsTitle: 'A cloud of the fixed points in front of the camera for describe the properties of space.',

					display: 'Display',
					displayTitle: 'Display or hide Frustum Points.',

					info: 'Information',
					infoTitle: 'Display information about frustum point if user move mouse over or click this point.',

					stereo: 'Stereo',
					stereoTitle: 'Frustum Points setting for stereo mode of the canvas',

					hide: 'Hide Nearby Points',
					hideTitle: 'Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.',

					opacity: 'Opacity',
					opacityTitle: 'Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.',

					near: 'Near Layer',
					nearTitle: 'Shift of the frustum layer near to the camera in percents.',

					far: 'Far Layer',
					farTitle: 'Shift of the frustum layer far to the camera in percents.',

					base: 'Scale',
					baseTitle: 'Scale of the base of the frustum points in percents.',

					square: 'Square Base',
					squareTitle: 'Square base of the frustum points.',

					defaultButton: 'Default',
					defaultTitle: 'Restore default Frustum Points settings.',

					zCount: 'Z Count',
					zCountTitle: "The count of layers of the frustum of the camera's field of view.",

					yCount: 'Y Count',
					yCountTitle: "The count of vertical points for each z level of the  frustum of the camera's field of view.",

				};
				switch ( options.getLanguageCode() ) {

					case 'ru'://Russian language

						lang.frustumPoints = 'Неподвижные точки';
						lang.frustumPointsTitle = 'Облако точек перед камерой для описания свойств пространства';

						lang.display = 'Показать';
						lang.displayTitle = 'Показать или скрыть неподвижные точки.';

						lang.info = 'Информация';
						lang.infoTitle = 'Отображать информацию о неподвижной точке, если пользователь наведет курсор мыши или щелкнет эту точку.';

						lang.stereo = 'Стерео';
						lang.stereoTitle = 'Настройки неподвижных точек для стерео режима холста';

						lang.hide = 'Близкие точки';
						lang.hideTitle = 'Скрыть близкие к камере точки в процентах ко всем точкам для более удобной визуализации.';

						lang.opacity = 'Непрозрачность';
						lang.opacityTitle = 'Число в диапазоне 0.0 - 1.0, указывающее, насколько прозрачены линии. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';

						lang.near = 'Ближний слой';
						lang.nearTitle = 'Смещение ближайшего к камере слоя точек в процентах.';

						lang.far = 'Дальний слой';
						lang.farTitle = 'Смещение дальнего от камеры слоя точек в процентах.';

						lang.base = 'Масштаб';
						lang.baseTitle = 'Масштаб неподвижных точек в процентах.';

						lang.square = 'Квадратное основание';
						lang.squareTitle = 'Неподвиждые точки образуют пирамиду с квадратным основанием.';

						lang.defaultButton = 'Восстановить';
						lang.defaultTitle = 'Восстановить настройки неподвижных точек.';

						lang.zCount = 'Z cлои';
						lang.zCountTitle = 'Количество слоев усеченной пирамиды, образующей поле зрения камеры';

						lang.yCount = 'Y точки';
						lang.yCountTitle = "Количество вертикальных точек в каждом слое усеченной пирамиды, образующей поле зрения камеры.";

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

				function saveSettings() {

					cookie.setObject( cookieName, shaderMaterial );

				}
				const fFrustumPoints = folder.addFolder( lang.frustumPoints );
				dat.folderNameAndTitle( fFrustumPoints, lang.frustumPoints, lang.frustumPointsTitle );

				function displayControllers( value ) {

					var display = value ? 'block' : 'none';
					folderPoint.display( display );
					cZCount.__li.style.display = display;
					cYCount.__li.style.display = display;

				}
				//Display frustumPoints
				const cDisplay = fFrustumPoints.add( shaderMaterial, 'display' ).onChange( function ( value ) {

					if ( shaderMaterial.display ) {

						update();

					} else {

						if ( options.raycaster ) options.raycaster.removeParticle( _points );
						removePoints();

					}
					displayControllers( shaderMaterial.display );
					saveSettings();

				} );
				dat.controllerNameAndTitle( cDisplay, lang.display, lang.displayTitle );

				//FrustumPoints info.
				//Display information about frustum point if user move mouse over or click this point.
				const cInfo = !options.raycaster ? undefined : fFrustumPoints.add( shaderMaterial, 'info' ).onChange( function ( value ) {

					if ( _points === undefined ) {

						saveSettings();
						return;

					}
					if ( shaderMaterial.info ) {

						if ( options.raycaster ) options.raycaster.addParticle( _points );
						
					} else {

						if ( options.guiSelectPoint ) options.guiSelectPoint.selectPoint( -1 );
						if ( options.raycaster ) options.raycaster.removeParticle( _points );

					}
					saveSettings();

				} );
				if ( cInfo ) dat.controllerNameAndTitle( cInfo, lang.info, lang.infoTitle );

				//Shift of the frustum layer near to the camera in percents
				const cNear = fFrustumPoints.add( shaderMaterial, 'near', 0, 100, 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cNear, lang.near, lang.nearTitle );

				//Shift of the frustum layer far to the camera in percents
				const cFar = fFrustumPoints.add( shaderMaterial, 'far', 0, 100, 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cFar, lang.far, lang.farTitle );

				//Scale of the base of the frustum points in percents.
				const cBase = fFrustumPoints.add( shaderMaterial, 'base', 0, 100, 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cBase, lang.base, lang.baseTitle );

				//Square base of the frustum points.
				const cSquare = fFrustumPoints.add( shaderMaterial, 'square' ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cSquare, lang.square, lang.squareTitle );

				const folderPoint = new FolderPoint( shaderMaterial.point, function ( value ) {

					//Не помню зачем это написал
					if ( value === undefined ) {

						console.warn( 'under constraction' );

					}
					if ( value < 0 )
						value = 0;

					_points.material.uniforms.pointSize.value = value;

					folderPoint.size.setValue( value );
					shaderMaterial.point.size = value;
					saveSettings();

				}, new Options( { dat: {gui: options.dat.gui } } ), {

					folder: fFrustumPoints,
					defaultPoint: { size: 0.01 },
					PCOptions: {

						settings: { offset: 0.1 },
						max: 0.1,

					},

				} );

				var toUpdate = true,//Когда пользователь нажимает кнопку Default надо установить toUpdate = false
					//что бы несколько раз не вызывался _this.update(); чтобы быстрее работало
					canUpdate = true,
					_this = this;

				function update() {

					if ( !toUpdate || !canUpdate )
						return;
					canUpdate = false;

					//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
					//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
					const index = options.guiSelectPoint ? options.guiSelectPoint.getMeshIndex( _points ) : undefined;

					if ( options.raycaster ) options.raycaster.removeParticle( _points );
					removePoints( true );

					_this.update( function () {

						//затем заменяю указатель на старый points в списке cMeshs на новый.
						if ( options.guiSelectPoint ) options.guiSelectPoint.setIndexMesh( index, _points );

						saveSettings();
						canUpdate = true;

						_points.userData.controllers();

					} );

				}

				//zCount
				const cZCount = fFrustumPoints.add( shaderMaterial, 'zCount' ).min( 3 ).step( 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cZCount, lang.zCount, lang.zCountTitle );

				//yCount
				const cYCount = fFrustumPoints.add( shaderMaterial, 'yCount' ).min( 3 ).step( 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cYCount, lang.yCount, lang.yCountTitle );

				//Default button
				dat.controllerNameAndTitle( fFrustumPoints.add( {

					defaultF: function ( value ) {

						toUpdate = false;

						cDisplay.setValue( optionsShaderMaterial.display );
						if ( cInfo ) cInfo.setValue( optionsShaderMaterial.info );

						cNear.setValue( optionsShaderMaterial.near );
						cFar.setValue( optionsShaderMaterial.far );
						cBase.setValue( optionsShaderMaterial.base );
						cSquare.setValue( optionsShaderMaterial.square );

						folderPoint.size.setValue( optionsShaderMaterial.point.size );

						cZCount.setValue( optionsShaderMaterial.zCount );
						cYCount.setValue( optionsShaderMaterial.yCount );

						toUpdate = true;
						update();
						saveSettings();

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
				displayControllers( shaderMaterial.display );

			}
			return this;

		}

		/** @class [GUI]{@link https://github.com/anhr/dat.gui} for select a frustum point.
		 *  Uses in the <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">guiSelectPoint</a>.
		 */
		this.guiSelectPoint = function () {

			var cFrustumPointsX = null, cFrustumPointsY = null, cFrustumPointsZ = null;
			_guiSelectPoint = this;
			/**
			 * create controls
			 * @param {GUI} fPoints parent folder. See [GUI]{@link https://github.com/anhr/dat.gui}.
			 * @param {string} languageCode Localization. The "primary language" subtag of the language version of the browser.
			 * <pre>
			 * Examples: "en" - English language, "ru" Russian.
			 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
			 * </pre>
			 */
			this.create = function ( fPoints, languageCode ) {

				const dat = three.dat;//options.dat.dat;
				function frustumPointsControl( name ) {


					//Localization

					const lang = {

						notSelected: 'Not selected',

					};

					switch ( languageCode ) {

						case 'ru'://Russian language
							lang.notSelected = 'Не выбран';

							break;

					}

					const controller = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						const index = _guiSelectPoint.getSelectedIndex();
						if ( index === null ) {

							if ( options.axesHelper ) options.axesHelper.exposePosition();
							return;

						}
						options.guiSelectPoint.select( { object: _points, index: index } );

					} );
					controller.__select[0].selected = true;
					//Не стоит переименовывать шкалы потому что шкала frustumPoints не совпадает со общей шкалой
					//			dat.controllerNameAndTitle( controller, scales[name].name ? scales[name].name : name );
					dat.controllerNameAndTitle( controller, name );
					return controller;

				}

				cFrustumPointsX = frustumPointsControl( 'x' );
				cFrustumPointsY = frustumPointsControl( 'y' );
				cFrustumPointsZ = frustumPointsControl( 'z' );

			}

			/**
			 * Append new item into controller
			 * @param {object} count Count of points in the FrustumPoints
			 * @param {number} count.xCount Count of rows of the points in the x axis
			 * @param {number} count.yCount Count of rows of the points in the y axis
			 * @param {number} count.zCount Count of layers of the points in the z axis
			 */
			this.appendChild = function ( count ) {

				function appendChild( cFrustumPoint, count ) {

					//thanks to https://stackoverflow.com/a/48780352/5175935
					cFrustumPoint.domElement.querySelectorAll( 'select option' ).forEach( option => { if ( option.value != '-1' ) option.remove() } );

					for ( var i = 0; i < count; i++ ) {

						var opt = document.createElement( 'option' );
						opt.innerHTML = i;
						cFrustumPoint.__select.appendChild( opt );

					}
					cFrustumPoint.setValue( -1 );//если не выбрать ни одной точки,
						//то при повторном выборе frustumPoints в списке cMeshs выберется точка, которая была выбрана прошлый раз.
						//Но индекс этой выбранной точки почему то не будет выбран в cFrustumPoints
						//Для проверки
						//выбрать точку frustumPoints в guiSelectPoint. Если есть оси кооддинат, то от выбранной точки появятся пунктирные линии.
						//Выбрать точку не frustumPoints в guiSelectPoint.
						//Опять выбрать точку frustumPoints в guiSelectPoint. Раньше появлялись пунктирные линии, но в огранах управления почемуто это точка не выбиралась.

				}
				appendChild( cFrustumPointsX, count.xCount );
				appendChild( cFrustumPointsY, count.yCount );
				appendChild( cFrustumPointsZ, count.zCount );

			}
			/**
			 * Sets to the controls the indexes of the selected frustum point.
			 * @param {object} index
			 * @param {object} index.x index of the x row of selected frustum point
			 * @param {object} index.y index of the y row of selected frustum point
			 * @param {object} index.z index of the z layer of selected frustum point
			 */
			this.pointIndexes = function ( index ) {

				if ( index === undefined )
					return;//Сюда попадает в отладочной версии когда не заданы имена точек
				if ( parseInt( cFrustumPointsX.getValue() ) !== index.x )
					cFrustumPointsX.setValue( index.x );
				if ( parseInt( cFrustumPointsY.getValue() ) !== index.y )
					cFrustumPointsY.setValue( index.y );
				if ( parseInt( cFrustumPointsZ.getValue() ) !== index.z )
					cFrustumPointsZ.setValue( index.z );

			};
			/**
			 * @returns frustum point index selected by user from controls.
			 * <p>null if user have not selected any point.</p>
			 */
			this.getSelectedIndex = function () {

				if ( _names === undefined ) {

					console.warn( 'Сюда попадает во время отладки когда не задаю имени каждой точки или когда the cDisplay checkbox of the frustumPoints is not checked' );
					return null;

				}
				const x = parseInt( cFrustumPointsX.getValue() ),
					y = parseInt( cFrustumPointsY.getValue() ),
					z = parseInt( cFrustumPointsZ.getValue() );
				if ( isNaN( x ) || ( x === -1 ) || isNaN( y ) || ( y === -1 ) || isNaN( z ) || ( z === -1 ) )
					return null;
				for ( var i = 0; i < _names.length; i++ ) {

					var name = _names[i];
					if ( ( typeof name !== "object" ) || ( name.z === undefined ) || ( name.z !== z ) )
						continue;
					for ( ; i < _names.length; i++ ) {

						name = _names[i];
						if ( ( typeof name !== "object" ) || ( name.y !== y ) )
							continue;
						for ( ; i < _names.length; i++ ) {

							name = _names[i];
							if ( typeof name === "object" ) {

								if ( ( x === 0 ) && ( name.y === y ) ) {

									//Сюда попадает когда в guiSelectPoint пользователь выбрал frustum Point с коодинатами 0,0,0,
									return i;

								}

							}
							if ( name === x ) {

								//console.warn( 'x = ' + x + ', y = ' + y + ', z = ' + z + ', i = ' + i );
								return i;

							}

						}

					}

				}
				console.error( 'FrustumPoints.selectPoint: not selected' );
				return null;

			}
			/**
			 * Display or hide the <b>FrustumPoints</b> controls.
			 * @param {string} display 'block' - display
			 * <p>'none' - hide</p>
			 */
			this.display = function ( display ) {

				cFrustumPointsX.domElement.parentElement.parentElement.style.display = display;
				cFrustumPointsY.domElement.parentElement.parentElement.style.display = display;
				cFrustumPointsZ.domElement.parentElement.parentElement.style.display = display;

			}
			/**
			 * Is FrustumPoints controls visible?
			 * @returns true - FrustumPoints controls is visible.
			 * */
			this.isDisplay = function () {

				if (
					( cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsY.domElement.parentElement.parentElement.style.display )
					|| ( cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsZ.domElement.parentElement.parentElement.style.display )
				)
					console.error( 'cFrustumPointsF.isDisplay failed!' );
				return cFrustumPointsX.domElement.parentElement.parentElement.style.display !== 'none';

			}

		}

		//делаю затычки на случай пустого _arrayCloud = [] массива координат точек, имеющих облако вокруг себя.
		//Другими словми если в программе нет ни одной точки с облаком вокруг себя.
		//В этом случае точки FrustumPoints не создаются
		this.gui = function () { console.warn( 'FrustumPoints.gui(): First, call FrustumPoints.pushArrayCloud(...) for push a points to the clouds array and call FrustumPoints.create(...).' ); }
		this.animate = function () { }
		this.updateGuiSelectPoint = function () { }
		this.isDisplay = function () { }
		this.onChangeControls = function () { }
		this.updateCloudPoints = function () { }
		this.updateCloudPoint = function () { }
		this.updateCloudPointItem = function () { }

	}

 }

export default FrustumPoints;
