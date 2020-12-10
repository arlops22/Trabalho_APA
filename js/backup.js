class Graph {

    constructor(nodes, nodehelper, edges) {
        this.nodes = nodes;
        this.nodehelper = nodehelper;
        this.edges = edges;
        this.nodeslist = [];
        this.colored = false;
        this.network;
        this.travessiaMode;
    }

    setMode(mode) {
        this.travessiaMode = mode;
    }

    getMode() {
        return this.travessiaMode;
    }

    getNodes() {
        return this.nodes;
    }

    setNodes(elem) {
        this.nodes = elem;
    }

    getNodeHelper() {
        return this.nodehelper;
    }

    setNodeHelper(elem) {
        this.nodehelper = elem;
    }

    getEdges() {
        return this.edges;
    }

    setEdges(elem) {
        this.edges = elem;
    }

    getNetwork() {
        return this.network;
    }

    pushNode(node) {
        this.nodeslist.push(node);
    }

    resetNodesList() {
        this.nodeslist = []
    }

    stop(interval) {
        clearInterval(interval)
    }

    createNetwork(container) {
         // Cria Network
         let nodesNetwork = new vis.DataSet(this.nodes);
        
         let edgesNetwork = new vis.DataSet(this.edges);
         
         let data = {
             nodes: nodesNetwork,
             edges: edgesNetwork,
             
         };

         let options = {
             physics: {
                enabled: true, 
                stabilization: {
                    enabled: true
                },
            }
        }
     
         this.network = new vis.Network(container, data, options);
    }

    setNodesColor(color, nodeIndex) {

        this.nodes[nodeIndex].color.background = color;
        this.nodeslist[nodeIndex].setColor(color);

        if (color == "#000") {
            this.nodes[nodeIndex].font.color = "#FFF"  
        }

        if (color == '#97C2FC') {
            this.nodes[nodeIndex].font.color = "#000"
        }

        this.network.setData({
            nodes: this.nodes,
            edges: this.edges
        })
        
    }

    setWhite(node) {
        if (typeof node.color.background == "undefined") 
        {   
            this.setNodesColor("#FFF", node.id - 1)
        }
    }

    resetGraphColors() {
        
        for(let i = 0; i < this.nodes.length; i++) {
            this.setNodesColor("#97C2FC", this.nodes[i].id - 1)
        }

        this.colored = false;
        console.log('Grafo resetado');
    }

    BFS_expand(nodeObj) {

        const frontier = new Array(nodeObj);
        let time = 0;

        while (frontier[0]) {

            let current = frontier.shift();

            const graph = this;

            if (typeof current.neighbor[0] != 'undefined') {

                current.neighbor.map(function(node) {
                    
                    if (node.color == "#FFF") {      
                        console.log("Vizinho: ", node)                  
                        graph.setNodesColor("#CCC", node.id - 1);
                        time = current.dTime + 1;
                        node.dTime = time;
                        frontier.push(node);
                    }
                })

            }
            console.log("Vizinhos de nó descobertos:", current);
            graph.setNodesColor("#000", current.id - 1);
            
            console.log("Novos nós a serem explorados: ", frontier);
        }
    }

    DFS_expand(nodeObj, stack) {

        const graph = this;
        
        console.log("Nó atual: ", nodeObj);
        graph.setNodesColor("#CCC", nodeObj.id-1);
        
        
        if (nodeObj.neighbor.length > 0) {
            
            nodeObj.neighbor.map(function(node) {
                
                if (node.color == "#FFF") {                        
                    
                    console.log("Nó a ser explorado:", node);
                    graph.DFS_expand(node, stack);
                    
                }
            })
            
        }
        
        graph.setNodesColor("#000", nodeObj.id-1);
        console.log("Nó explorado: ", nodeObj);

    }
}

class Node {

    constructor(id, label) {
        this.id = id;
        this.label = label;
        this.dTime = 0;
        this.neighbor = [];
        this.color;
    }

    connect(nodeId) {
        this.neighbor.push(nodeId)
    }

    setColor(color) {
        this.color = color;
    }

}


document.addEventListener('DOMContentLoaded', function() {
    
    const grafo = document.getElementById('grafo');
    const tvLargura = document.getElementById('largura');
    const tvProfundidade = document.getElementById('profundidade');

    const grafoOrientado = document.getElementById('orientado');
    const grafoNaoOrientado = document.getElementById('nao-orientado');
    const dataSet = document.getElementById('dataset');

    let nodeslist = [];
    let nodeshelp = [];
    let edgelist = [];

    const graph = new Graph(nodeslist, nodeshelp, edgelist);

    // Evento executado com a mudança de caracteres em campo de texto "dataSet"
    dataSet.addEventListener('input', function() {

        let nodesValue = dataSet.value.replace(/(?:\r\n|\r|\n)/g, ' ').split(' ');
        let edgesValue = dataset.value.split('\n');
        

        let nodeslist = [];
        let nodeshelp = [];
        let edgelist = [];

        let id = 0

        graph.resetNodesList();
        // Adiciona os nós ao data set da network
        nodesValue.map(function(node){

            if (node !== '' && nodeshelp.indexOf(node) == -1) {
                id++;
                const no = new Node(id, node);
                graph.pushNode(no);

                nodeslist.push({id: id, label: node, color: {border: '#000'}, font: { color: "#000" }});
                nodeshelp.push(node);
            }    

        });

        // Adicionas as arestas ao data set da network
        edgesValue.forEach(function(elem) {
            if (elem.length > 1) 
            {
                let edge = elem.split(' ');
                if (grafoOrientado.checked) 
                {               
                    edgelist.push({from: nodeshelp.indexOf(edge[0]) + 1, to: nodeshelp.indexOf(edge[1]) + 1, arrows: 'to', color: {color: "#000"}});

                    graph.nodeslist[nodeshelp.indexOf(edge[0])].connect(graph.nodeslist[nodeshelp.indexOf(edge[1])]);
                } 
                else if (grafoNaoOrientado.checked) 
                {
                    edgelist.push({from: nodeshelp.indexOf(edge[0]) + 1, to: nodeshelp.indexOf(edge[1]) + 1, color: {color: "#000"}});
                    
                    graph.nodeslist[nodeshelp.indexOf(edge[0])].connect(graph.nodeslist[nodeshelp.indexOf(edge[1])]);
                    graph.nodeslist[nodeshelp.indexOf(edge[1])].connect(graph.nodeslist[nodeshelp.indexOf(edge[0])]);
                }
            }
        });

        graph.setNodes(nodeslist);
        graph.setNodeHelper(nodeshelp);
        graph.setEdges(edgelist);

        graph.createNetwork(grafo);

    });

    const startNode = document.getElementById('startnode');
    tvLargura.addEventListener('click', function() {


        let count = 0;
        let frontier = [];
        let exploreds = [];

        let interval = setInterval(function() {
            const helper = graph.getNodeHelper();

            // Pinta nós de Branco
            if (count < graph.nodes.length) {
                
                if (typeof graph.nodes[count].color.background == "undefined") 
                {
                    graph.setNodesColor("#FFF", graph.nodes[count].id - 1)
                }
            }

            // TP Largura
            if (count >= graph.nodes.length && helper.indexOf(startNode.value) > -1) 
            {
                console.log(count);
                let tvCount = count - graph.nodes.length;
                let current;
                console.log(tvCount)

                if (exploreds.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1 && frontier.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1) {
                    
                    frontier.push(graph.nodeslist[helper.indexOf(startNode.value)]);
                    console.log("primeiro nó", frontier[0]);
                }
                
                if (frontier.length == 0) {
                    console.log("Não existem fronteiras");
                    console.log(tvCount)

                    if (graph.nodeslist[tvCount].color == "#FFF") {
                        console.log("Proximo no: ", graph.nodeslist[tvCount])
                        frontier.push(graph.nodeslist[tvCount]);
                        count = graph.nodes.length - 1; 
                    }
                }

                if ( frontier.length != 0) {
                    if (tvCount < frontier[0].neighbor.length) 
                    {   
                        if (frontier[0].neighbor[tvCount].color == "#FFF") {
                            
                            console.log("Vizinho encontrado:",frontier[0].neighbor[tvCount])
                            graph.setNodesColor("#CCC", frontier[0].neighbor[tvCount].id - 1);
                            frontier.push(frontier[0].neighbor[tvCount])
                        }
                    }
                }

                if (tvCount == frontier[0].neighbor.length) {
                    console.log("Fim dos vizinhos");
                    graph.setNodesColor("#000", frontier[0].id - 1);

                    current = frontier.shift();
                    exploreds.push(current);
                    console.log("Current: ", current);
                    console.log("Nos explorados:", exploreds)

                    count = graph.nodes.length - 1;
                }

                if (frontier[0].neighbor.length == 0) {
                    console.log("Nó não tem vizinhos")
                    graph.setNodesColor("#000", frontier[0].id - 1);

                    current = frontier.shift();
                    exploreds.push(current);
                    console.log("Current: ", current);
                    console.log("Nos explorados:", exploreds)

                    count = graph.nodes.length - 1;
                    tvCount--;
                }


                /*

                let current = frontier.shift();

                console.log(current)


                console.log(frontier)

                if (count - graph.nodes.length == current.neighbor.length) {
                    graph.setNodesColor("#000", current.id - 1);
                    console.log()
                }
                if(tvCount == graph.nodes.length) {
                    console.log("contadores iguais", tvCount);
                    count = graph.nodes.length;
                }
            */

            }


            if (exploreds.length == graph.nodeslist.length) {
                graph.stop(interval)
            }

            count++;
        }, 700);

        /*if (graph.getMode() == 'profundidade') {
            graph.resetGraphColors();
        }
        let helper = graph.getNodeHelper();
        
        graph.paintGraph('#FFF');
        console.log("Grafo completamente branco.")
        
        // Aplica o travessia em Largura
        if (graph.colored) {

            if (helper.indexOf(startNode.value) > -1 && graph.nodeslist[helper.indexOf(startNode.value)].color == "#FFF") {
                graph.BFS_expand(graph.nodeslist[helper.indexOf(startNode.value)]);
                
            }
            for (let i = 0; i < graph.nodeslist.length; i++) 
            {
                if (graph.nodeslist[i].color == "#FFF")
                {
                    graph.BFS_expand(graph.nodeslist[i]); 
                }
            }
        }

        graph.setMode('largura');*/
    });

    tvProfundidade.addEventListener('click', function() {

        let count = 0;
        
        let interval = setInterval(function() {
            const helper = graph.getNodeHelper();

            // Pinta nós de Branco
            if (count < graph.nodes.length) {
                
                if (typeof graph.nodes[count].color.background == "undefined") 
                {
                    graph.setNodesColor("#FFF", graph.nodes[count].id - 1)
                }
            }

            // TP Profundidade
            if (count >= graph.nodes.length && helper.indexOf(startNode.value) > -1) 
            {
                console.log(count);
                let tvCount = count - graph.nodes.length;
                let current;
                console.log(tvCount)

                if (exploreds.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1 && frontier.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1) {
                    
                    frontier.push(graph.nodeslist[helper.indexOf(startNode.value)]);
                    console.log("primeiro nó", frontier[0]);
                }
                
                if (frontier.length == 0) {
                    console.log("Não existem fronteiras");
                    console.log(tvCount)

                    if (graph.nodeslist[tvCount].color == "#FFF") {
                        console.log("Proximo no: ", graph.nodeslist[tvCount])
                        frontier.push(graph.nodeslist[tvCount]);
                        count = graph.nodes.length - 1; 
                    }
                }

                if ( frontier.length != 0) {
                    if (tvCount < frontier[0].neighbor.length) 
                    {   
                        if (frontier[0].neighbor[tvCount].color == "#FFF") {
                            
                            console.log("Vizinho encontrado:",frontier[0].neighbor[tvCount])
                            graph.setNodesColor("#CCC", frontier[0].neighbor[tvCount].id - 1);
                            frontier.push(frontier[0].neighbor[tvCount])
                        }
                    }
                }

                if (tvCount == frontier[0].neighbor.length) {
                    console.log("Fim dos vizinhos");
                    graph.setNodesColor("#000", frontier[0].id - 1);

                    current = frontier.shift();
                    exploreds.push(current);
                    console.log("Current: ", current);
                    console.log("Nos explorados:", exploreds)

                    count = graph.nodes.length - 1;
                }

                if (frontier[0].neighbor.length == 0) {
                    console.log("Nó não tem vizinhos")
                    graph.setNodesColor("#000", frontier[0].id - 1);

                    current = frontier.shift();
                    exploreds.push(current);
                    console.log("Current: ", current);
                    console.log("Nos explorados:", exploreds)

                    count = graph.nodes.length - 1;
                    tvCount--;
                }


                /*

                let current = frontier.shift();

                console.log(current)


                console.log(frontier)

                if (count - graph.nodes.length == current.neighbor.length) {
                    graph.setNodesColor("#000", current.id - 1);
                    console.log()
                }
                if(tvCount == graph.nodes.length) {
                    console.log("contadores iguais", tvCount);
                    count = graph.nodes.length;
                }
            */

            }


            if (exploreds.length == graph.nodeslist.length) {
                graph.stop(interval)
            }

            count++;
        }, 700);

        /*if (graph.getMode() == 'largura') {
            graph.resetGraphColors();
        }

        let helper = graph.getNodeHelper();

        // Colore tudo de Branco
        graph.paintGraph('#FFF');
        
        // Aplica o travessia em Largura
        if (graph.colored) {

            const stack = new Array();

            if (helper.indexOf(startNode.value) > -1 && graph.nodeslist[helper.indexOf(startNode.value)].color == "#FFF") 
            { 
                graph.DFS_expand(graph.nodeslist[helper.indexOf(startNode.value)], stack);    
            }

            for (let i = 0; i < graph.nodeslist.length; i++) 
            {
                if (graph.nodeslist[i].color == "#FFF")
                {
                    graph.DFS_expand(graph.nodeslist[i], stack); 
                }
            }

        }

        
        graph.setMode('profundidade');*/
        
    });
})