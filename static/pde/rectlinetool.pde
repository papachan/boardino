class RectLineTool implements Tool{

    private List rectlines;
    private boolean painting=false;
    private int color_line;
    private int stroke_weight;
    private int origin_x;
    private int origin_y;


    public RectLineTool(List rectlines){
        this.rectlines = rectlines;
        this.color_line = 0;
        this.stroke_weight = 1;
    }

    public void draw(){
        for(int j=0;j<rectlines.size();j++){
           rectlines.get(j).show();
        }
        if(currentTool == this && painting){
            stroke(stroke_weight);
            line(origin_x, origin_y, mouseX, mouseY);
            javaScript.onCreatingRectLine(origin_x, origin_y, mouseX, mouseY, hex(color_line), stroke_weight, false);
            
        }
    }

    public void setColor(int color_line){
        this.color_line = color_line;
    }

    public void setStrokeWeight(int stroke_weight){
        this.stroke_weight = stroke_weight;
    }

    public void mousePressed(){
        painting = true;
        origin_x=mouseX;
        origin_y=mouseY;    
    }

    public void mouseClicked(){
/*        painting = !painting;
        if(painting){
            origin_x=mouseX;
            origin_y=mouseY;
        }
        else { 
            rectlines.add(new Line(origin_x, origin_y, mouseX, mouseY, color_line, stroke_weight)); 
            javaScript.onCreatedLine(origin_x, origin_y, mouseX, mouseY, hex(color_line), stroke_weight, true);
            }*/
    }

    public void mouseDragged(){
        painting = true;
         
    }

    public void mouseReleased(){
        painting = false;
        rectlines.add(new Line(origin_x, origin_y, mouseX, mouseY, color_line, stroke_weight));
        javaScript.onCreatedLine(origin_x, origin_y, mouseX, mouseY, hex(color_line), stroke_weight, true);
    }

    public void keyPressed(){
    }
}
