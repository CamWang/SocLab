// PaperScript Configuration

    <html>
        <head>
            <title>Dot</title>
            <script type="text/javascript" src="paper.js"></script>
            <script type="text/paperscript" src="dot.js" canvas="myCanvas"></script>
        </head>
    
        <body>
            <canvas id="myCanvas" resize></canvas>
        </body>
    </html>


// To define a point
    
    // Normal version
    var myPoint = new Point();
    console.log(myPoint);       // { x: 0, y: 0 }
    myPoint.x = 10;
    myPoint.y = myPoint.x + 10;
    console.log(myPoint);       // { x: 10, y: 20 }

    // Shorter version
    var myPoint = new Point(20, 40);

    // Copy a point
    var firstPoint = new Point(20, 40);
    var secondPoint = firstPoint;

    // Or
    var firstPoint = new Point(20, 40);
    var secondPoint = firstPoint.clone();


// To define a size

    //Normal version
    var mySize = new Size();
    mySize.width = 10;
    mySize.height = mySize.width + 10;

    //Shorter version
    var mySize = new Size(20, 40);


// Rectangle

    // Normal version
    var topLeft = new Point(10, 20);
    var rectSize = new Size(200, 100);
    var rect = new Rectangle(topLeft, rectSize);    //new Rectangle(point, size)

    // A shorter version
    var rect = new Rectangle(10, 20, 200, 100);     //new Rectangle(x, y, width, height)
    
    // Point to Point Method
    var bottomLeft = new Point(10, 120);
    var topRight = new Point(210, 20);
    var rect = new Rectangle(bottomLeft, topRight); //new Rectangle(point1, point2)

    // You can also use this shorter version
    var rect = new Rectangle(new Point(10, 120),new Point(210, 20));

    // Rectangle exposes a series of additional center and corner point objects: center, 
    // topLeft, topRight, bottomLeft, bottomRight, leftCenter, topCenter, rightCenter and 
    // bottomCenter.
    var rect = new Rectangle();
    console.log(rect);           // Default position { x: 0, y: 0, width: 0, height: 0 }

    rect.size = new Size(100, 200); 
    rect.center = new Point(100, 100);
    console.log(rect);           // { x: 50, y: 0, width: 100, height: 200 }

    // A complex way to define a rectangle
    var rect = new Rectangle();
    rect.left = 100;
    rect.right = 200;
    rect.bottom = 400;
    rect.top = 200;
    console.log(rect);           // { x: 100, y: 200, width: 100, height: 200 }

    //Use Array to define a rectangle
    var rect = new Rectangle({ x: 10, y: 20, width: 100, height: 200 });

    //Use an array containing or an array
    rect.size = [200, 300];  rect.size = { x: 200, y: 400 };

// Mathematical Operations

    var point1 = new Point(10, 20);

    // Create a second point that is 4 times the first one.
    var point2 = point1 * 4;
    console.log(point2);   // { x: 40, y: 80 }

    // Now we calculate the difference between the two.
    var point3 = point2 - point1;
    console.log(point3);   // { x: 30, y: 60 }

    // Create yet another point, with a numeric value added to point3:
    var point4 = point3 + 30;
    console.log(point4);   // { x: 60, y: 90 }

    // A third of that?
    var point5 = point4 / 3;
    console.log(point5);   // { x: 20, y: 30 }

    // Multiplying two points with each other multiplies each coordinate seperately
    var point6 = point5 * new Point(3, 2);
    console.log(point6);   // { x: 60, y: 60 }


    //Math Functions are also available
    var point = new Point(1.2, 1.8);

    // Round the point:
    var rounded = point.round();
    console.log(rounded); // { x: 1, y: 2 }

    // Round the point up:
    var ceiled = point.ceil();
    console.log(ceiled); // { x: 2, y: 2 }

    // Round the point down:
    var floored = point.floor();
    console.log(floored); // { x: 1, y: 1 }


    // Random Values
    // Create a point whose x is between 0 and 50, and y is between 0 and 100
    var point = new Point(50, 100) * Point.random();

    // Create a size whose width is between 0 and 50, and height is between 0 and 100
    var size = new Size(50, 100) * Size.random();


//Vector Geometry
    // VISIT http://paperjs.org/tutorials/geometry/vector-geometry/ TO KNOW MORE
    // VISIT http://paperjs.org/tutorials/geometry/vector-geometry/ TO KNOW MORE
    // VISIT http://paperjs.org/tutorials/geometry/vector-geometry/ TO KNOW MORE
    // VECTOR 向量
    var point1 = new Point(50, 50);
    var point2 = new Point(110, 200);

    var vector = point2 - point1;

    console.log(vector.length);  // 161.55494
    console.log(vector.angle);   // 68.19859

    // Two vectors subtracts create a third vector
    var point1 = new Point(50, 0);
    var point2 = new Point(40, 100);

    var point3 = new Point(5, 135);
    var point4 = new Point(75, 170);

    var vector1 = point2 - point1;  // = { x: 40, y: 100 } - { x: 50, y: 0 }  = { x: -10, y: 100 }
    var vector2 = point4 - point3;  // = { x: 75, y: 170 } - { x: 5, y: 135 } = { x: 70, y: 35 }

    var vector = vector1 + vector2;  //Form V1 start to V2 end.
    var vector = vector1 - vector2;  //Form V1 start to V2 end.
    var bigVector = smallVector * 3; //Multiply
    var smallVector = bigVector / 3; //Division
    // Please notice that the vector multiplied or divided must on the left-hand side
    // Because the javascript will define the nature of the type returned from the operation
    // as the left-hand side.

    // Change length
    var vector = new Point(24, 60);
    vector.length = vector.length * 3;
    vector.length = 100;

    // Normalize 单位向量化
    var vector = new Point(24, 60); 
    var normalizedVector = vector.normalize();
    console.log(vector.length);             // 64.62198
    console.log(normalizedVector.length);   // 1

    var normalizedVector = vector.normalize(10);
    console.log(normalizedVector.length);   // 10
    // normalize() does not modify the vector it is called on, 
    // instead it returns a new normalized vector object.

    //Angles
    //Mesure angles in degrees and from horizontal right (0°) to horizontal left (±180°) 
    var vector = new Point(100, 100);
    console.log(vector.angle);  // 45
    
    vector.angle = 135;
    console.log(vector);        // { x: -100, y: 100 }
    
    vector.angle = vector.angle + 90;
    vector.angle += 90;


// PATH
    // VISIT http://paperjs.org/tutorials/paths/working-with-path-items/ TO KNOW MORE
    // VISIT http://paperjs.org/tutorials/paths/working-with-path-items/ TO KNOW MORE
    // VISIT http://paperjs.org/tutorials/paths/working-with-path-items/ TO KNOW MORE

    //Adding and Inserting Segments
    var myPath = new Path();          //new Path() 
    myPath.strokeColor = 'black';
    myPath.add(new Point(0, 0));      //path.add(segment) 
    myPath.add(new Point(100, 50));

    //Do the upper two lines
    myPath.add(new Point(0, 0), new Point(100, 50));

    // insert a segment between the two existing
    // segments in the path:
    myPath.insert(1, new Point(30, 40));  //path.insert(index, segment) 

    //Smoothing Paths (to create a round circle)
    var path = new Path();
    path.strokeColor = 'black';
    //Create a square
    path.add(new Point(30, 75)); 
    path.add(new Point(30, 25)); 
    path.add(new Point(80, 25));
    path.add(new Point(80, 75));
    //Create a closed square shape
    path.closed = true;
    // Select the path, so we can see its handles:
    path.fullySelected = true;
    // Create a copy of the path and move it 100pt to the right:
    var copy = path.clone();
    copy.fullySelected = true;
    copy.position.x += 100;
    // Smooth the segments of the copy:
    copy.smooth();

    //Remove Segments and Paths (path.removeSegment(index))
    //Create a circle
    var myCircle = new Path.Circle(new Point(100, 70), 50);
    myCircle.strokeColor = 'black';
    myCircle.selected = true;
    //A circle has four segments and it delete the left segment
    myCircle.removeSegment(0);
    