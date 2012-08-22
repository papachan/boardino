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
            if(selectedPostIt!=null)
                selectedPostIt.pressed();
            return;
        }

        if (pendingToCreatePostit()){
            createPostIt();
        }else{
            trySelectingPostit();
            if(selectedPostIt==null){
                addPostit(9999, "", mouseX, mouseY);
                javaScript.onCreatingPostit(mouseX, mouseY);
            }else{
                selectedPostIt.pressed();
            }
        }
    }

    public void mouseDragged(){
        postit = searchFirstSelected();
        if(postit!=null){
            postit.move(mouseX - postit.postit_i.width/2, mouseY - postit.postit_i.height/2);
            javaScript.onPostitMoved(postit.id, postit.x, postit.y);
        }
    }

    public void mouseReleased(){
        postit = searchFirstSelected();
        if(postit!=null)
            javaScript.onPostitReleased(postit.id, postit.x, postit.y);
    }

    public void keyPressed(){
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

    private void createPostIt(){
        PostIt postit = postits.get(9999);
        javaScript.onNewPostit(postit.x, postit.y, postit.feed);
        postits.remove(9999);
    }

}
