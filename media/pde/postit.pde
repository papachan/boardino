class PostIt{
    int id;
    float x, y;
    PImage postit_i;
    String feed;
    boolean selected = false;
    boolean friendSelected = false;
    float _width;
    float _height;

    PostIt(int id, String text, float x, float y){
        this.id = id;
        this.feed = text;
        this.x = x;
        this.y = y;
        postit_i = loadImage(postit_image_url);
        postit_i.resize(0, height/4);
        this._width = postit_i.width;
        this._height = postit_i.height;
        this.selected = false;
    }

    PostIt(int id, String text){
        this(id, text, width/2, height/2);
    }

    void show(){
        if (isNew()){
            rect(x, y, postit_i.width, postit_i.height);
        }
        if(selected){
            fill(0);
            rect(x, y, postit_i.width, postit_i.height);
        }
        if(friendSelected){
            fill(color(200, 0, 0));
            rect(x, y, postit_i.width, postit_i.height);
        }
        image(postit_i, x, y);
        showText();
    }

    void showText(){
        fill(0);
        text(feed, x+30, y+40, this._width-60, this._height-60);
    }

    boolean isNew(){
        return id==9999;
    }

    boolean hovered(){
        if (mouseX > x && mouseX < (postit_i.width + x)){
            if (mouseY > y && mouseY < (postit_i.height + y)){
                return true;
            }
        }
        return false;
    }

    void select(){
        this.selected = true;
    }

    void friendSelect(){
        this.friendSelected = true;
    }

    void friendDeselect(){
        this.friendSelected = false;
    }

    void deselect(){
        this.selected = false;
    }

    void move(float x, float y){
        this.x = x;
        this.y = y;
    }
}