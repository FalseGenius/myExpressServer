const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {day} = require('./clutter.js');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
let da = day();

const uri = 'mongodb://forAshir:defaultPassword@cluster0-shard-00-00.8bwhi.mongodb.net:27017,cluster0-shard-00-01.8bwhi.mongodb.net:27017,cluster0-shard-00-02.8bwhi.mongodb.net:27017/myExpressServer?ssl=true&replicaSet=atlas-6guudj-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
  }).then(() => {
    console.log('Connection successful');
  }).catch((err) => {
  console.log(err);
})
const db = mongoose.connection;
const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model('Item', itemSchema);


const listSchema = {
  name: String,
  items: [itemSchema]
}
const List = mongoose.model('List', listSchema);

const item1 = new Item({
  name: 'Something is wrong and I can feel it'
});

const defaultt = [item1];



app.get('/', (req, res) => {
  Item.find((err, docs) => {
    res.render('list', {foo:'Today', item: docs});
    // if (docs.length === 0) {
    //   Item.insertMany(defaultItems, (err, docs) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('success');
    //     }
    //   })
    //   res.redirect('/');
    // } else {
    //   if (err) {
    //     res.render('list', {foo: da, item: []})
    //   } else {
    //     res.render('list', {foo: da, item: docs})
    //   }
    // }
  })
});

app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName;
  List.findOne({name: customListName}, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultt
        });

        list.save();
        res.redirect('/' + customListName);
      } else {
        res.render('list', {foo:customListName, item:foundList.items});
      }
    }
  })
})

app.get('/work', (req, res) => {
  res.render('list', {foo: 'Work List', item: workList});
});

app.post('/delete', (req, res) => {
  console.log(req.body.checkbox);
  Item.findByIdAndRemove({_id: req.body.checkbox}, async () => {
    await console.log('Deleted');
  });

  res.redirect('/');
})

app.post('/', async (req, res) => {
  const b = req.body.button;
  const ite = req.body.something;
  const item = new Item({
    name: ite
  });
  if (b === 'Today') {
    await item.save();
    res.redirect('/');
  } else {
    List.findOne({name: b}, (err, foundItems) => {
      console.log(foundItems.items);
      foundItems.items.push(item);
      foundItems.save();
      res.redirect('/' + b)
    });

  }
})


app.listen(app.get('port'), () => {
  console.log('Listening on port 3000');
})
