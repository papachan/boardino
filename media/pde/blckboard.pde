// Post-it BlackBoard
/* @pjs preload="/media/postit.gif"; */
String postit_image_url = "/media/postit.gif";
ArrayList postits;

void setup(){
  size(800, 400);
  postits = new ArrayList();
  postits.add(new PostIt("test note 1"));
}

void draw(){
  background(255);
  for (int i = postits.size() - 1; i >= 0; i--){
    PostIt postit = (PostIt) postits.get(i);
    postit.show();
  }
}

class PostIt{
  float x, y;
  PImage postit_i;
  String feed;
  PostIt(String feed_a){
    x = width/2;
    y = height/2;
    postit_i = loadImage(postit_image_url);
    postit_i.resize(0, height/4);
    feed = feed_a;
  }
  
  void show(){
    if (mousePressed && clicked()) {
      noFill();
      rect(x, y, postit_i.width, postit_i.height);
      float rpos_x = mouseX - x;
      float rpos_y = mouseY - Y;
      move_xy(mouseX - rpos_x, mouseY - rpos_y);   
    }
    image(postit_i, x, y);
    fill(0);
    text(feed, x+15, y+50);
  }
  
  boolean clicked(){
    if (mouseX > x && mouseX < (postit_i.width + x)){
      if (mouseY > y && mouseY < (postit_i.height + y)){
        return true;
      }
    }
    return false;
  }
  
  void move_xy(float x_a, float y_a){
    x = x_a;
    y = y_a;
  }
  
}

/*
void mousePressed(){
  for (int i = postits.size() - 1; i >= 0; i--){
    PostIt postit = (PostIt) postits.get(i);
    if (postit.clicked()){
      noFill();
      rect(postit.x,postit.y,postit.postit_i.width, postit.postit_i.height);
      postit.move_xy(mouseX - postit.postit_i.width, mouseY - postit.postit_i.height);
    }
  }
}*/
