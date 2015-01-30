/// <reference path="Libs/three.min.js" />
/// <reference path="libs/dat.gui.min.js" />
/// <reference path="libs/stats.min.js" />
/// <reference path="Libs/OrbitControls.js" />




//author: Yue Zhao  1-29-2015
//filename: BirdMan.js

//declare global variables
var scene, camera, renderer, webGLRenderer, canvasRenderer;
var stats, controls;
var cube, sphere, plane;
var meshMaterial;

var step = 0;
var oldContext = null;


function init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a render and set the size
    webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(0xeeeeee, 1.0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;


    renderer = webGLRenderer;

    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);
}

function addGeometries() {
    var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({ color: 0x777777 }));
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -20;
    scene.add(groundMesh);

    var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    var cubeGeometry = new THREE.CubeGeometry(15, 15, 15);
    var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


    meshMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff });

    sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    plane = new THREE.Mesh(planeGeometry, meshMaterial);

    // position the sphere
    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;


    cube.position = sphere.position;
    plane.position = sphere.position;


    // add the sphere to the scene
    scene.add(cube);
}

function initGui() {
    controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;
        this.overdraw = meshMaterial.overdraw;
        this.visible = meshMaterial.visible;
        this.side = "front";

        this.color = meshMaterial.color.getStyle();
        this.wireframe = meshMaterial.wireframe;
        this.wireframeLinewidth = meshMaterial.wireframeLinewidth;
        this.wireFrameLineJoin = meshMaterial.wireframeLinejoin;

        this.selectedMesh = "cube";

        this.switchRenderer = function () {
            if (renderer instanceof THREE.WebGLRenderer) {
                document.body.removeChild(renderer.domElement)
                renderer = canvasRenderer;
                document.body.appendChild(renderer.domElement);
            } else {
                document.body.removeChild(renderer.domElement)
                renderer = webGLRenderer;
                document.body.appendChild(renderer.domElement);
            }
        }
    }

    var gui = new dat.GUI();


    var spGui = gui.addFolder("Mesh");
    spGui.add(controls, 'opacity', 0, 1).onChange(function (e) {
        meshMaterial.opacity = e
    });
    spGui.add(controls, 'transparent').onChange(function (e) {
        meshMaterial.transparent = e
    });
    spGui.add(controls, 'wireframe').onChange(function (e) {
        meshMaterial.wireframe = e
    });
    spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function (e) {
        meshMaterial.wireframeLinewidth = e
    });
    spGui.add(controls, 'visible').onChange(function (e) {
        meshMaterial.visible = e
    });
    spGui.add(controls, 'side', ["front", "back", "double"]).onChange(function (e) {
        console.log(e);
        switch (e) {
            case "front":
                meshMaterial.side = THREE.FrontSide;
                break;
            case "back":
                meshMaterial.side = THREE.BackSide;
                break;
            case "double":
                meshMaterial.side = THREE.DoubleSide
                break;
        }
        meshMaterial.needsUpdate = true;
        console.log(meshMaterial);
    });
    spGui.addColor(controls, 'color').onChange(function (e) {
        meshMaterial.color.setStyle(e)
    });
    spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (e) {

        scene.remove(plane);
        scene.remove(cube);
        scene.remove(sphere);

        switch (e) {
            case "cube":
                scene.add(cube);
                break;
            case "sphere":
                scene.add(sphere);
                break;
            case "plane":
                scene.add(plane);
                break;

        }

        scene.add(e);
    });

    gui.add(controls, 'switchRenderer');
    var cvGui = gui.addFolder("Canvas renderer");
    cvGui.add(controls, 'overdraw').onChange(function (e) {
        meshMaterial.overdraw = e
    });
    cvGui.add(controls, 'wireFrameLineJoin', ['round', 'bevel', 'miter']).onChange(function (e) {
        meshMaterial.wireframeLinejoin = e
    });

}

function setupCameraAndLight() {
    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // position and point the camera to the center of the scene
    camera.position.x = -20;
    camera.position.y = 50;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function animate() {
    stats.update();

    cube.rotation.y = step += 0.01;
    plane.rotation.y = step;
    sphere.rotation.y = step;

    // render using requestAnimationFrame
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initStats() {
    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px'; 
    document.body.appendChild(stats.domElement);
}

window.onload = function () {
    init();
    addGeometries();
    setupCameraAndLight();
    initStats();
    initGui();
    animate();
};