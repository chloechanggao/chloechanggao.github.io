if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;

var camera, controls, scene, renderer;

var meshBox, meshPlane1, meshPlane2, meshPlane3, boxTexture, geometry, material;

var light1, light2, light3, light4, light5;

var girlmixer;

var worldWidth = window.innerWidth,
    worldDepth = window.innerHeight,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2,
    VIEW_ANGLE = 45,
    ASPECT = worldWidth / worldDepth,
    NEAR = 0.1,
    FAR = 20000;
var clock = new THREE.Clock();



init();
animate();

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    controls = new THREE.OrbitControls(camera);

    camera.position.set(0, 30, 350);

    camera.lookAt(0, 0, 0);

    controls.enableZoom = false;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;
    controls.target = new THREE.Vector3(0, 0, -10000000);
    controls.rotateSpeed = 0.000001;




    //lighting
    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0xF5FFFA, 0.0015);

    light1 = new THREE.AmbientLight(0xE6E6FA);
    //light1.position.set(0, 250, 160);
    //light1.castShadow = true;


    scene.add(light1);

    light2 = new THREE.DirectionalLight(0xFFFFFF, 0.075);
    light2.position.set(22.5, 30, 45);

    scene.add(light2);

    light3 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    light3.position.set(0, 200, 15);
    light3.castShadow = true;


    light3.shadow.mapSize.width = 512;
    light3.shadow.mapSize.height = 512;
    light3.shadow.camera.near = -80;
    light3.shadow.camera.far = 1500;

    light3.shadow.camera.Left = -400;
    light3.shadow.camera.right = 400;
    light3.shadow.camera.top = 400;
    light3.shadow.camera.bottom = -900;

    scene.add(light3);


    light4 = new THREE.AmbientLight(0xFFFFFF, 0.25);
    light4.position.set(-100, -230, 300);
    //light4.castShadow = true;
    scene.add(light4)

    var sphere = new THREE.SphereGeometry(0.25, 16, 8);
    light5 = new THREE.PointLight(0xFFD39B, 0.7, 100, 2.0);
    light5.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        color: 0xff0040
    })));
    scene.add(light5);



    scene.add(new THREE.CameraHelper(light2.shadow.camera));
    scene.add(new THREE.CameraHelper(light3.shadow.camera));
    //scene.add(new THREE.CameraHelper(light4.shadow.camera));


    //building
    var loader = new THREE.ColladaLoader();
    loader.load('shared/bmodelv4.dae', function(result) {
        building = result.scene;
        mixer = new THREE.AnimationMixer(building);
        building.traverse(function(child) {
            if (child instanceof THREE.SkinnedMesh) {
                var clip = THREE.AnimationClip.parseAnimation(child.geometry.animation, child.geometry.bones);
                mixer.clipAction(clip, child).play();
            }
        });
        building.position.set(-53, 5, 244);
        building.rotation.set(3 * Math.PI / 2, 0, 2.3);
        building.scale.set(.2, .2, .2);

        building.castShadow = true;
        building.receiveShadow = true;
        building.children[0].castShadow = true;
        building.children[0].receiveShadow = true

        for (i = 0; i < building.children[0].children.length; i++) {
            var mesh = building.children[0].children[i];
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = new THREE.MeshStandardMaterial({
                //color: 0xF0F8FF,
                //map: boxTexture,
                side: THREE.DoubleSide
            });
        }
        //avantar
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('shared/walking.dae', function(girl) {
            var girl = girl.scene;
            girlmixer = new THREE.AnimationMixer(girl);
            girl.traverse(function(child) {
                if (child instanceof THREE.SkinnedMesh) {
                    var clip = THREE.AnimationClip.parseAnimation(child.geometry.animation, child.geometry.bones);
                    girlmixer.clipAction(clip, child).play();
                }
            });
            girl.position.set(17.5, 7.85, 280);
            girl.scale.set(0.2, 0.2, 0.2);

            console.log(girl);
            scene.add(girl);
        });


        console.log(building);

        scene.add(building);

    });


    //environment

    var planeSize = 10000;
    var offset = 7;

    //plane1
    geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    material = new THREE.MeshStandardMaterial({
        color: 0xF0F8FF,
        //map: boxTexture,
        side: THREE.DoubleSide
    });
    meshPlane1 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane1);
    meshPlane1.position.set(0, planeSize / 2, 55);

    //plane2
    geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    material = new THREE.MeshStandardMaterial({
        color: 0x1C1C1C,
        //map: boxTexture,
        side: THREE.DoubleSide
    });
    meshPlane2 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane2);
    meshPlane2.position.set(0, -5000 + offset, 100);

    //plane3
    geometry = new THREE.PlaneGeometry(planeSize, 600);
    material = new THREE.MeshStandardMaterial({
        transparent: true,
        color: 0xA1A1A1,
        //map: boxTexture,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    meshPlane3 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane3);
    meshPlane3.position.set(0, offset, 0);
    geometry.rotateX(-Math.PI / 2);




    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.addEventListener('mousemove', onMouseWheel, false);

    container.innerHTML = "";

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onMouseWheel(event) {

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);


}

//

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}

function render() {
    controls.update();

    var delta = clock.getDelta();
    if (mixer !== undefined) {
        mixer.update(delta);
    }

    var time = Date.now() * 0.00025;

    light5.position.x = 70 + Math.sin(time * 0.7) * 50;
    light5.position.y = 30 + Math.cos(time * 0.7) * 60;
    light5.position.z = 320

    //console.log(light5.position);

    renderer.render(scene, camera);

}
