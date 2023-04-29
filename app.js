const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require('mysql2');


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json())
var comment=[];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const staffContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const clientContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const propertyContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const leaseContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const commentContent = "comment content";

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'mysqlpassword',
    database : 'dreamhome'
  });



connection.promise().connect()
    .then(() => {
        console.log('Connected to MySQL server');
    })
    .catch((err) => {
        console.error('Error connecting to MySQL server:', err);
    });



app.get("/",function(req,res){
  connection.query(`select propertyNo,street,rent from property order by no_of_adver DESC`,
    (err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      res.render('main',{item:result});
    })
});

app.get("/property_display",function(req,res){
  let result=[]
  res.render("property_display",{result});
});

app.get("/query",function(req,res){
  res.render("home");
});

app.get("/staff",function(req,res){
  res.render("staffReg");
});
app.get("/property",function(req,res){
  res.render("propReg");
});
app.get('/advertise',(req,res)=>{
  res.render('add')
})
app.get("/property_display",function(req,res){
  let result=[]
  res.render("property_display",{result});
});

app.get("/staffdisplay",function(req,res){
  let result=[]
  res.render("staff_display",{result});
});

app.get("/top3",(req,res)=>{
  connection.query(`select * from property order by no_of_adver DESC`,
    (err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      // res.render('home',{top:top})
      res.json(result)
    })
})

app.post('/advertise',(req,res)=>{
  const {propertyNo}=req.body
  connection.query(`update property set no_of_adver=no_of_adver+1 where propertyNo='${propertyNo}'`,(err,result)=>{
    if(err){
      return res.send(err).status(500)
    }
    res.redirect('/')
  })
})

app.post("/staff",async(req,res)=>{
  const{staffNo,branchNo,fname,lname,position,sex,DOB,salary}=req.body;
  const val1=[staffNo,branchNo,fname,lname,position,sex,DOB,salary]
  connection.query(`INSERT INTO staff (staffNo,branchNo,fname,lname,position,sex,DOB,salary) VALUES (?,?,?,?,?,?,?,?)`,val1,(err,result)=>{
    if(err){
      return res.send(err).status(500)
    }
  })
  if(position==='manager'){
    const {mgr_start_date,supervisor_id,mgr_bonus}=req.body
    const val2=[staffNo,mgr_start_date,supervisor_id,mgr_bonus]
    connection.query(`INSERT INTO manager_details (staffNo,mgr_start_date,supervisor_id,mgr_bonus) 
    VALUES (?,?,?,?)`,(err,result)=>{
      if(err){
        return res.send(err).status(500)
      }
    })
  }
  res.redirect("/");
});

app.post('/getstaff',(req,res)=>{
  const {branch}=req.body
  if(branch!=='all'){
    connection.query(`select staffNo,fname,lname,position,branchNo from staff where branchNo='${branch}'`,
    (err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      res.render('staff_display',{result:result})
    })
  }else{
    connection.query("select staffNo,fname,lname,position,branchNo from staff",(err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      res.render('staff_display',{result:result})
    })
  }
})

app.post('/getProperty',(req,res)=>{
  const {isrented}=req.body
  if(isrented==='all'){
    connection.query(`select * from property`,
    (err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      res.render('property_display',{result:result})
      // res.json(result)
    })
  }else if(isrented==='rented'){
    connection.query(`select * from property  where isrented=${1}`,
    (err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      res.render('property_display',{result:result})
    })
  }else{
    connection.query(`select * from property  where isrented=${0}`,
    (err,result)=>{
      if(err){
        res.send(err).status(500)
      }
      res.render('property_display',{result:result})
    })
  }
})


app.post("/property",async(req,res)=>{
  const {propertyNo,type,rooms,rent,street,city,postcode,ownerNo,staffNo} = req.body;
    const sql1="INSERT INTO property(propertyNo,type,rooms,rent,street,city,postcode,ownerNo,staffNo,isrented,no_of_adver) values (?,?,?,?,?,?,?,?,?,?,?)";
    values1=[propertyNo,type,rooms,rent,street,city,postcode,ownerNo,staffNo,0,0];
    connection.query(sql1, values1, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      console.log("Property created successfully");
      return res.redirect('/');
    });
});






app.post("/client",async(req,res)=>{
  const {client_id,fname,lname,tel_no,type,max_rent,branch_id,reg_by,reg_date
    } = req.body;
    const sql1="INSERT INTO client(clientno,staffno,fname,lname,telno,preftype,maxrent,date_reg) values (?,?,?,?,?,?,?,?)";
    values=[client_id,reg_by,fname,lname,tel_no,type,max_rent,reg_date]
    connection.promise().query(sql1, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error occurred while creating the client");
      }
    
      console.log("Property created successfully");
      return res.status(200).send("Property created successfully");
    });
    res.redirect("/");
});

app.post("/comments",async(req,res)=>{
  const {client_no,prop_no,view_date,comments
    } = req.body;
    const sql1="INSERT INTO viewing(clientNo, propertyNo, viewDate, comment) values (?,?,?,?)";
    values=[client_no,prop_no,view_date,comments]
    connection.promise().query(sql1, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error occurred while creating the client");
      }
      console.log("Property created successfully");
      return res.status(200).send("Property created successfully");
    });
    res.redirect("/");
});



app.post("/lease",async(req,res)=>{
  const {clientNo,propertyNo,rent,paymentMethod,deposit_paid,rentStartDt,rentEndDt} = req.body;
    const sql1="INSERT INTO lease(clientNo,propertyNo,rent,paymentMethod,deposit_paid,rentStartDt,rentEndDt) values (?,?,?,?,?,?,?)";
    values=[clientNo,propertyNo,rent,paymentMethod,deposit_paid,rentStartDt,rentEndDt]
    connection.query(sql1, values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred while creating the lease");
      }
    });
    connection.query(`update property set isrented=${1} where propertyNo='${propertyNo}'`,(err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred while creating the lease");
      }
    });
    res.redirect("/");
});



app.get("/client",function(req,res){
  res.render("clientReg");
});
app.get("/lease",function(req,res){
  res.render("leaseReg");
});
app.get("/comments",function(req,res){
  res.render("comments");
});

app.post("/result/1",function(req,res){
  const city = req.body.city;
  connection.query(`select * from branch where city = '${city}'`,(err,result)=>{
    if(err)
    console.log(err)
    res.render("result",{results:result})
    // res.send(result)
  })
});

app.post("/result/2",function(req,res){
  connection.query(`select count(branchNo) as Count,city from branch group by city` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/3",function(req,res){
  const branch_no=req.body.branch_no;
  connection.query(`select fname as firstname,lname as lastname,position,salary from staff where branchNo = '${branch_no}' order by fname
  ` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/4",function(req,res){

  connection.query(`select count(staffNo) as staff_count,sum(salary) from staff` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/5",function(req,res){
  
  connection.query(`select count(s.staffNo) as staffCount,s.position as position from (select staffNo,position from staff where branchno in
    (select branchno from branch where city='Glasgow')) as s group by position ` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/6",function(req,res){
  connection.query(`select fname as firstname,lname as lastname,branch.branchno as branch_id from staff,branch where staffNo=manager_id order by branch.city;
  ` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/7",function(req,res){
  const supervisor_id=req.body.supervisor_id;
  connection.query(`select fname as firstname,lname as lastname from staff where staffno in 
  (select staffNo from manager_details where supervisor_id='${supervisor_id}')
  ` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/8",function(req,res){
  
  connection.query(`select propertyNo as property_id,street,city,type,rent from property where city='Glasgow' order by rent

  ` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/9",function(req,res){
  const fname=req.body.fname;
  const lname=req.body.lname;
  connection.query(`select * from property where staffNo in (select staffNo from staff where fname='${fname}' and lname='${lname}');

  ` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});





app.post("/result/10",function(req,res){
  const branch=req.body.branch;
  connection.query(`SELECT s.fName, s.lName, COUNT(p.propertyNo) AS total_properties
  FROM staff s
  LEFT JOIN property p ON s.staffNo = p.staffNo
  WHERE s.branchNo = '${branch}'
  GROUP BY s.staffNo;` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/11",function(req,res){
  const {branchNo}=req.body;
  connection.query(`SELECT p.propertyNo, p.street, p.city, p.postcode, p.type, p.rooms, p.rent, o.fName AS owner_fname, o.lName AS owner_lname
  FROM property p
  INNER JOIN ownerNo o ON p.ownerNo = o.ownerNo
  INNER JOIN staff s ON p.staffNo = s.staffNo
  WHERE s.branchNo = '${branchNo}' AND p.isbusiness=1` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/12",function(req,res){
  // const branch=req.body.branch;
  connection.query(`SELECT type, COUNT(*) AS total_properties
  FROM property
  GROUP BY type;` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/13",function(req,res){
  // const branch=req.body.branch;
  connection.query(`SELECT o.ownerNo, o.fName, o.lName, o.address, o.telNo, COUNT(p.propertyNo) AS total_properties
  FROM ownerNo o
  INNER JOIN property p ON o.ownerNo = p.ownerNo
  WHERE p.type = 'private' 
  GROUP BY o.ownerNo, o.fName, o.lName, o.address, o.telNo
  HAVING COUNT(p.propertyNo) > 1;` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/14",function(req,res){
  // const branch=req.body.branch;
  connection.query(`SELECT *
  FROM property
  WHERE type = 'flat' AND rooms >= 3 AND rent <= 500 AND city = 'Aberdeen';` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/15",function(req,res){
  const branch=req.body.branch;
  connection.query(`SELECT c.clientNo, c.fName, c.lName, c.telNo, c.prefType
  FROM client c
  JOIN staff s ON c.staffno = s.staffNo
  WHERE s.branchNo = 'b001';` ,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/17",function(req,res){
  connection.query(`SELECT lease.leaseId, lease.clientNo, lease.Rent, lease.propertyNo, lease.paymentMethod, lease.deposit_paid, lease.rentStartDt, lease.rentEndDt
  FROM lease
  INNER JOIN property ON lease.propertyNo = property.propertyNo
  INNER JOIN branch ON property.city = branch.city
  WHERE branch.branchNo = 'given branch name'
  AND Month(rentEndDt)=Month(curdate())+1;`,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/18",function(req,res){
  connection.query(`SELECT COUNT(*) AS total_leases
  FROM branch b
  JOIN staff s ON b.branchNo = s.branchNo
  JOIN property p ON s.staffNo = p.staffNo
  JOIN lease l ON p.propertyNo = l.propertyNo
  WHERE b.city = 'London'
  AND month(l.rentEndDt) - month(l.rentStartDt) < 12;`,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/19",function(req,res){
  connection.query(`SELECT branch.branchNo, SUM(property.rent) AS total_daily_rental
  FROM property
  INNER JOIN branch ON property.city = branch.city
  GROUP BY branch.branchNo
  ORDER BY branch.branchNo;
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/20",function(req,res){
  connection.query(`SELECT s.staffNo, s.fName, s.lName, s.position, s.sex, s.DOB, s.salary, b.branchNo, b.street, b.city, b.postcode
  FROM staff s
  JOIN manager_details m ON s.staffNo = m.staffNo
  JOIN branch b ON s.branchNo = b.branchNo
  WHERE m.supervisor_id = 'S001';  
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/21",function(req,res){
  const {branchNo}=req.body
  if(!branchNo)
    return res.send("Enter branch number.")
  connection.query(`SELECT fname,branchNo FROM staff
  WHERE position = 'assistant' AND branchNo = '${branchNo}'
  ORDER BY fname ASC`,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/22",function(req,res){
  connection.query(`select p.propertyNo,p.rent,O.fname from property p
  inner join ownerNo O on p.ownerNo=O.ownerNo;  
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/23",function(req,res){
  connection.query(`SELECT *
  FROM property
  WHERE staffNo = (
    SELECT staffNo
    FROM staff
    WHERE fName = 'John'
      AND lName = 'Doe'
      AND branchNo = 'B001'
  );    
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});

app.post("/result/24",function(req,res){
  connection.query(`SELECT c.clientNo, c.fName, c.lName, s.fName AS staff_fName, s.lName AS staff_lName
  FROM client c
  INNER JOIN staff s ON c.staffno = s.staffNo;  
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});


app.post("/result/25",function(req,res){
  const city = req.body.city;
  connection.query(`
  SELECT *
  FROM property
  WHERE city = 'Glasgow' AND rent <= 800;
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/26",function(req,res){
  const propertyNo = req.body.propertyNo;
  connection.query(`
  select O.fname,O.lName,O.telNo from property p
  inner join ownerNo O on p.ownerNo=O.ownerNo
  where p.propertyNo='${propertyNo}';
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/27",function(req,res){
  const propertyNo = req.body.propertyNo;
  connection.query(`
  SELECT c.fName, c.lName, v.viewDate, v.comment
  FROM client c
  JOIN viewing v ON c.clientNo = v.clientNo
  WHERE v.propertyNo = '${propertyNo}';
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/28",function(req,res){
  const propertyNo = req.body.propertyNo;
  connection.query(`
  SELECT c.fName, c.lName, c.telNo
  FROM client c
  JOIN viewing v ON c.clientNo = v.clientNo
  WHERE v.propertyNo = '${propertyNo}' AND v.comment IS NULL;
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/29",function(req,res){
  const propertyNo = req.body.propertyNo;
  const clientNo = req.body.clientNo;
  connection.query(`
  select * from lease
  where clientNo='${clientNo}' and propertyNo='${propertyNo}';  
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});
app.post("/result/30",function(req,res){
  connection.query(`
  SELECT lease.leaseId, lease.clientNo, lease.Rent, lease.propertyNo, lease.paymentMethod, lease.deposit_paid, lease.rentStartDt, lease.rentEndDt
  FROM lease
  INNER JOIN property ON lease.propertyNo = property.propertyNo
  INNER JOIN branch ON property.city = branch.city
  WHERE branch.branchNo = 'given branch name'
  AND Month(rentEndDt)=Month(curdate())+1;  
  `,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});



app.post("/result/31",function(req,res){
  connection.query(`SELECT *
  FROM property
  WHERE propertyNo NOT IN (
    SELECT DISTINCT propertyNo
    FROM lease
    WHERE month(current_date()) - month(STR_TO_DATE(rentEndDt, '%d/%m/%Y')) > 3
  );`,(err,result)=>{
    if(err)
      console.log(err)
    res.render('result',{results:result})
  })
});



app.listen(3000,function(){
	console.log("listening at port 3000");
});



