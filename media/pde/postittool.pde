class PostitTool implements Tool{

    private HashMap postits;
    private PostIt selectedPostit;

    public PostitTool(HashMap postits, selectedPostit){
        this.postits = postits;
        this.selectedPostit = selectedPostit;
    }

    public void mousePressed(){
        if(selectedPostIt!=null){
            deselectCurrentPostit();
            trySelectingPostit();
            return;
        }

        if (pendingToCreatePostit()){
            createPostIt();
        }else{
            trySelectingPostit();
            if(selectedPostIt==null)
                addPostIt(9999, "Write text...", mouseX, mouseY);
        }
    }

    public void mouseDragged(){
        Iterator i = postits.entrySet().iterator();
        postit = searchFirstSelected();
        if(postit!=null){
            postit.move(mouseX - postit.postit_i.width/2, mouseY - postit.postit_i.height/2);
            javaScript.onPostitMoved(postit.id, postit.x, postit.y);
        }
    }

    public void keyPressed(){
        if (postits.containsKey(9999)){
            PostIt postit = (PostIt) postits.get(9999);
            if( ((key>='A')&&(key<='Z')) || ((key>='a')&&(key<='z')) || ((key>='0')&&(key<='9')) || (key == ' ')){
              postit.feed = concat(postit.feed, new String(key));
            }
            if(keyCode == BACKSPACE){
                postit.feed = postit.feed.substring(0, postit.feed.length() -1);
            }
        }
    }

    public void mouseClicked(){
    }

    private void trySelectingPostit(){
        postit = searchFirstHovered();
        if (postit!=null){
            selectPostit(postit);
        }
    }

    private void selectPostit(PostIt postit){
        postit.select();
        javaScript.onPostitSelected(postit.id);
        selectedPostIt = postit;
    }

    private void deselectCurrentPostit(){
        selectedPostIt.deselect();
        javaScript.onPostitDeselected(selectedPostIt.id);
        selectedPostIt = null;
    }

    private boolean pendingToCreatePostit(){
        return postits.containsKey(9999);
    }

    private PostIt searchFirstHovered(){
        Iterator i = postits.entrySet().iterator();
        while (i.hasNext()) {
            Map.Entry entry = (Map.Entry)i.next();
            PostIt postit = (PostIt)entry.getValue();
            if (postit.hovered()){
                return postit;
            }
        }
        return null;
    }

    private PostIt searchFirstSelected(){
        Iterator i = postits.entrySet().iterator();
        while (i.hasNext()) {
            Map.Entry entry = (Map.Entry)i.next();
            PostIt postit = (PostIt)entry.getValue();
            if (postit.selected){
                return postit;
            }
        }
        return null;
    }

}
