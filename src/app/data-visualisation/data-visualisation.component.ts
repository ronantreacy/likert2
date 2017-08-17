import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';

import { Response } from "../models/response";
import * as fromRoot from '../state-management/reducers';

interface Data {
    labels: string[];
    responses: Response[];
    chartType: string;
}
type LinePoint = {
    x: any,
    y: any
};

@Component({
    selector: 'app-data-visualisation',
    templateUrl: './data-visualisation.component.html',
})
export class DataVisualisationComponent implements OnInit {

    @ViewChild('chart') private chartContainer: ElementRef;
    private data: Data = {
        labels: [],
        responses: [],
        chartType: 'bubbles'
    };
    pngData: string;
    downloadText: string;
    private width: number;
    private height: number;
    private chart: any;
    private svg: any;
    private xAxis: any;
    private colourScale: any;

    constructor(
        private store: Store<fromRoot.State>
    ) {
        store.select(fromRoot.getLabels)
            .subscribe (labels => {
                this.data.labels = labels;
                if (this.chart){
                    this.updateChart();
                }
            })
        store.select(fromRoot.getChartType)
            .subscribe(chartType => {
                this.data.chartType = chartType;
                if (this.chart){
                    this.updateChart();
                }
            })
        store.select(fromRoot.getResponses)
            .subscribe(responses => {
                this.data.responses = responses;
                if (this.chart){
                    this.updateChart();
                }
            })
    }

    ngOnInit() {
        this.createChart();
        this.updateChart();
    }

    createChart() {
        let element = this.chartContainer.nativeElement;
        this.width = 1140;
        this.height = 0;
        this.svg = d3.select(element).append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        this.chart = this.svg.append('g')
            .attr('width', this.width)
            .attr('height', this.height);
        this.chart.append("rect")
            .attr("class", "bg")
            .attr("height", this.height)
            .attr("width", this.width)
            .attr("fill", "#fff")
    }

    updateChart() {
        var lineFun = d3.line<LinePoint>()
            .x(d => {return d.x})
            .y(d => {return d.y})

        this.colourScale = function(index: number): string {
            if (this.data.chartType == "bubbles"){
                return d3.scaleLinear<string>()
                    .domain([0, 100])
                    .range(["#BBDEFB","#1E88E5"])(index);
            }
            else{
                if (index < (this.data.labels.length - 1) / 2){
                    return d3.scaleLinear<string>()
                        .domain([0, (this.data.labels.length + 1) / 2])
                        .range(["#E53935","#EF9A9A"])(index);
                }
                else if (index > (this.data.labels.length - 1) / 2){
                    return d3.scaleLinear<string>()
                        .domain([(this.data.labels.length - 1) / 2, this.data.labels.length - 1])
                        .range(["#90CAF9","#1E88E5"])(index);
                }
                else{
                    return d3.scaleLinear<string>()
                        .domain([index-1, index+1])
                        .range(["#90CAF9","#EF9A9A"])(index);
                }
            }
        };

        var hasLabels = this.data.labels.some(d => {
            return d != "" && d != null;
        });

        this.height = 
            (hasLabels ? 100 : 80 )
             + (this.data.chartType == 'bubbles' ? 100 : 70) * this.data.responses.length + 30;

        // Check if chart needs to be made bigger
        // If it needs to be reduced this will be done in a transition at the end
        if (parseFloat(this.chart.attr("height")) < this.height){
            this.chart.attr('height', this.height);
            this.svg.attr('height', this.height);
            this.chart.selectAll(".bg").attr("height", this.height);
        }

        var topLinePoints = [
            {y:hasLabels ? 100 : 80, x: 465},
            {y:hasLabels ? 100 : 80, x: 1065},
        ];

        var topLine = this.chart.selectAll(".topLine").data([""])
        topLine.enter().append("path")
            .attr("class", "topLine")
            .merge(topLine)
            .attr("stroke", "#414141")
            .attr("stroke-width", 1)
            .attr("d", lineFun(topLinePoints));

        var bottomLinePoints = [
            {y:this.height-30, x: 465},
            {y:this.height-30, x: 1065},
        ];

        var bottomLine = this.chart.selectAll(".bottomLine").data([""])
        bottomLine.enter().append("path")
            .attr("class", "bottomLine")
            .merge(bottomLine)
            .attr("stroke", "#414141")
            .attr("stroke-width", 1)
            .attr("d", lineFun(bottomLinePoints));

        var numberLabels = this.data.labels.length;

        var labels = this.chart.selectAll(".label").data(this.data.labels)

        labels.exit().remove()

        var newLabels = labels.enter().append("g")
            .attr("class", "label")

        newLabels.append("path")
            .attr("class", "topTick")
        newLabels.append("path")
            .attr("class", "bottomTick")
        newLabels.append("text")

        labels = newLabels.merge(labels)

        labels.select("path.topTick")
            .attr("stroke", "#414141")
            .attr("stroke-width", 1)
            .attr("d", (d, i) => {
                return lineFun([
                    {y: hasLabels ? 100 : 80, x: 465 + i*600/(numberLabels-1)},
                    {y: hasLabels ? 90 : 70, x: 465 + i*600/(numberLabels-1)},
                ])
            });

        labels.select("path.bottomTick")
            .attr("stroke", "#414141")
            .attr("stroke-width", 1)
            .attr("d", (d, i) => {
                return lineFun([
                    {y: this.height - 30, x: 465 + i*600/(numberLabels-1)},
                    {y: this.height - 20, x: 465 + i*600/(numberLabels-1)},
                ])
            });
        
        labels.select("text")
            .attr("x", (d, i) => {
                return 465+i*600/(numberLabels-1)
            })
            .attr("y", (d) => {
                return d != "" && d != null ? 54  : 30;
            })
            .text((d) => {
                return d != "" && d != null ? d : null;
            })
            .attr("fill", '#414141')
            .attr("text-anchor", "middle")
            .style("font-family", "Arial")
            .style("font-size", "14px");

        if (this.data.chartType == 'stackedBar'){

            var maxDistance = 0;
            var leftEnd = numberLabels % 2 != 0 ? (numberLabels-1)/2 : numberLabels/2;
            var rightStart = numberLabels % 2 != 0 ? leftEnd + 2 : leftEnd + 1;
            var centre = numberLabels %2 != 0 ? leftEnd + 1 : null;

            for (var d=0; d<this.data.responses.length; d++){
                var leftAmount = 0;
                var rightAmount = 0;
                var totalAmount = 0;
                for (var i=0; i<numberLabels; i++){
                    totalAmount += this.data.responses[d].responses[i];
                    if(i+1<=leftEnd){
                        leftAmount += this.data.responses[d].responses[i];
                    }
                    else if (i+1>= rightStart){
                        rightAmount += this.data.responses[d].responses[i];
                    }
                    else{
                        rightAmount += this.data.responses[d].responses[i] / 2
                        leftAmount += this.data.responses[d].responses[i] / 2
                    }
                }

                var biggerAmount = Math.max(leftAmount,rightAmount);

                if (biggerAmount * 100 / totalAmount > maxDistance){
                    maxDistance = biggerAmount * 100 / totalAmount;
                }
            }

        }

        var rows = this.chart.selectAll(".row").data(this.data.responses);

        rows.exit().remove();

        var newRows = rows.enter().append("g")
            .attr("class", "row")

        newRows.append("g")
            .attr("class", "rowText")

        newRows.append("g")
            .attr("class", "rowResponses")

        rows = newRows.merge(rows);
        rows.attr("data-index", (d, i) => {return i.toString()})

        var rowTexts = rows.select(".rowText").selectAll("text").data((d, i) => {

            if (d.question.length < 58){
                return [{y: this.data.chartType == 'bubbles' ? 56 : 41, text: d.question, j: i}]
            }

            var textArray = [];
            var breakPoints = [];
            var noOfRows = Math.floor(d.question.length / 58 )
            
            for (var r=0; r<=noOfRows; r++){

                for (var b = (r>0 ? breakPoints[r-1] : 0) + 59; b>=0; b--){
                    if (d.question.substr(b,1) == ' ' || b == d.question.length){
                        breakPoints.push(b);
                        break;
                    }
                }

                var textStart = r>0 ? breakPoints[r-1] : 0;
                var textLength = breakPoints[r] - textStart;

                textArray.push({
                    y: (this.data.chartType == 'bubbles' ? 56 : 41) - 14 * noOfRows / 2 + r * 14,
                    text: d.question.substr(textStart, textLength),
                    j: i
                })
            }
            return textArray;
        })

        rowTexts.exit().remove();
        rowTexts.enter().append("text").merge(rowTexts)
            .attr("x", 20)
            .attr("y", (d, i) => {
                return (hasLabels ? 100 : 80 ) + d.j * (this.data.chartType == 'bubbles' ? 100 : 70) + d.y;
            })
            .text((d) => { return d.text; })
            .attr("fill", '#414141')
            .attr("text-anchor", "start")
            .style("font-family", "Arial")
            .style("font-size", "14px");

        var rowResponses = rows.select('.rowResponses').selectAll('.response').data((d, i) => {
            var totalNumber = d.responses.reduce((a,b) => {return a + b});
            var centreIndex = (d.responses.length - 1) / 2;
            var leftCount = 0;
            var rightCount = 0;
            d.responses.forEach((r, j) => {
                if (j == centreIndex){
                    leftCount += r/2;
                    rightCount += r/2;
                }
                else if (j < centreIndex){
                    leftCount += r;
                }
                else if (j > centreIndex){
                    rightCount += r;
                }
            });
            var maxLeftRight = 2 * Math.max(leftCount, rightCount);
            var offset = maxLeftRight / 2 - leftCount;
            return d.responses.map((r, j) => {
                var rData =  {
                    j: i,
                    centreIndex: centreIndex,
                    percentage: totalNumber > 0 ? r*100/totalNumber : 0,
                    value: r,
                    offset: offset,
                    maxLeftRight: maxLeftRight,
                    bubbleSize: (2 * Math.sqrt( 900 * r/totalNumber )) >= 6 ? 2 * Math.sqrt( 900 * r/totalNumber ) : 6,
                };
                offset += r;
                return rData;
            });
        });

        rowResponses.exit().remove();
        var newRowResponses = rowResponses.enter()
            .append('g')
            .attr('class', 'response')

        newRowResponses.append("circle");
        newRowResponses.append("rect");
        newRowResponses.append("text");

        rowResponses = newRowResponses.merge(rowResponses);

        if (this.data.chartType == 'bubbles'){
            rowResponses.select("circle")
                .attr("stroke", (d) => {
                    return d3.rgb(this.colourScale(d.percentage))
                        .darker(0.5).toString();
                })
                .attr("fill", (d) => {
                    return this.colourScale(d.percentage)
                })
                .attr('r', (d) => { return d.bubbleSize/2; })
                .attr('cx', (d, i) => { return 465 + i*600/(numberLabels-1); })
                .attr('cy', (d, i) => { 
                    return (hasLabels ? 100 : 80 ) + d.j * 100 + 40;
                });
            rowResponses.select('text')
                .attr("x", (d,i) => { 
                    return 465+i*600/(numberLabels-1); 
                })
                .attr("y", (d,i) => {
                    return (hasLabels ? 100 : 80 ) + d.j * 100 + 90;
                })
                .text((d,i) => { return d.percentage.toFixed(0)+'%'; })
                .attr("fill", '#414141')
                .attr("text-anchor", "middle")
                .style("font-family", "Arial")
                .style("font-size", "14px");
            rowResponses.select('rect')
                .attr('fill', 'none')
                .attr('stroke', 'none');

        }
        else{
            rowResponses.select('rect')
                .attr('x', (d, i) => {
                    return d3.scaleLinear().domain([0, d.maxLeftRight]).range([465, 1065])(d.offset);
                })
                .attr('y', (d, i) => { 
                    return (hasLabels ? 100 : 80 ) + d.j * 70 + 5;
                })
                .attr('width', (d, i) => {
                    return d3.scaleLinear().domain([0, d.maxLeftRight]).range([0, 600])(d.value);
                })
                .attr('stroke', (d, i) => {
                    return d3.rgb(this.colourScale(i))
                        .darker(0.5).toString();
                })
                .attr('fill', (d, i) => {
                    return this.colourScale(i);
                })
                .attr('height', 60);
            rowResponses.select('text')
                .attr("x", (d,i) => { 
                    return d3.scaleLinear().domain([0, d.maxLeftRight]).range([465, 1065])(d.offset + d.value/2);
                })
                .attr("y", (d,i) => {
                    return (hasLabels ? 100 : 80 ) + d.j * 70 + 41;
                })
                .text((d,i) => { return d.percentage.toFixed(0)+'%'; })
                .attr("fill", '#414141')
                .attr("text-anchor", "middle")
                .style("font-family", "Arial")
                .style("font-size", "14px");
            rowResponses.select('circle')
                .attr('fill', 'none')
                .attr('stroke', 'none');

        }

        //Convert to PNG
        var chartHtml = (this.svg
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node() as any).parentNode.innerHTML;

        var imgSrc = 'data:image/svg+xml;base64,'+ btoa(chartHtml);

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;

        var newImg = new Image;
        newImg.src = imgSrc;
        newImg.onload = () => {

            context.drawImage(newImg, 0, 0, this.width, this.height);

            this.pngData = canvas.toDataURL("image/png");
            var now = new Date();
            var nowText = 
                ('0' + now.getDate()).slice(-2) + '-' +
                ('0' + (now.getMonth()+1)).slice(-2) + '-' +
                now.getFullYear() + ' ' +
                ('0' + now.getHours()).slice(-2) + '-' +
                ('0' + now.getMinutes()).slice(-2) + '-' +
                ('0' + now.getSeconds()).slice(-2);
            this.downloadText = 'Likert Chart ' + nowText;

        };
    }

}
