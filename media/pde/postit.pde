class PostIt{
    int id;
    float x, y;
    float mouseOffsetX, mouseOffsetY;
    PImage postit_i;
    PImage closeButtonImage;
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
        closeButtonImage = loadImage(postit_close_url);
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
        if(hovered()){
            image(closeButtonImage, x+postit_i.width-closeButtonImage.width, y);
        }
        //showText();
    }

    //void showText(){
        //javaScript.onShowTextPostit(this.id, this.feed, this.x, this.y);

        //fill(0);
        //text(feed, x+30, y+40, this._width-60, this._height-60);
    //}

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
        javaScript.onPostitMovedText(this.id, this.x, this.y);
    }

    void pressed(){
        if(mouseOverCloseButton())
            javaScript.onDeletedPostit(id);
        else {
            this.mouseOffsetX = this.x - mouseX;
            this.mouseOffsetY = this.y - mouseY;
        }
    }

    boolean mouseOverCloseButton(){
        if (mouseX > x+postit_i.width-closeButtonImage.width && mouseX < (x+postit_i.width)){
            if (mouseY > y && mouseY < (closeButtonImage.height + y)){
                return true;
            }
        }
        return false;
    }
}
