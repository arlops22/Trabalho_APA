class Graph {

    constructor(nodes, nodehelper, edges) {
        this.nodes = nodes;
        this.nodehelper = nodehelper;
        this.edges = edges;
        this.nodeslist = [];
        this.oriented;
        this.network;
        this.animation = null;
        this.animationVelo = 1500;
    }

    setVelo(velo) {
        this.animationVelo = velo;
    }

    setAnimation(timer) {
        this.animation = timer;
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

    changeEdges(edges) {

        this.edges = edges;

        if (this.network) {
            this.network.setData({
                nodes: this.nodes,
                edges: edges
            });
        }
    }
    
    setNodesColor(color, nodeIndex) {

        if (color == "#000") {
            this.nodes[nodeIndex].font.color = "#FFF"
            this.nodes[nodeIndex].color.background = color;
            this.nodeslist[nodeIndex].setColor(color);
        }

        else if (color == '#97C2FC') {
            this.nodes[nodeIndex].font.color = "#000"
            this.nodes[nodeIndex].color.background = color;
            this.nodeslist[nodeIndex].setColor(color);
        }
        else 
        {
            this.nodes[nodeIndex].color.background = color;
            this.nodeslist[nodeIndex].setColor(color);
        }

        this.network.setData({
            nodes: this.nodes,
            edges: this.edges
        })
        
    }

    /*
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

    }*/
    
}

class Node {

    constructor(id, label) {
        this.id = id;
        this.label = label;
        this.dTime = 0;
        this.neighbor = [];
        this.color;
    }

    resetNeighbor() {
        this.neighbor = []
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

    const grafoOrientado = document.getElementById('orientado');
    const grafoNaoOrientado = document.getElementById('nao-orientado');
    const dataSet = document.getElementById('dataset');
    const startNode = document.getElementById('startnode');
    const explorados = document.getElementById('lista-nodes')

    const tvLargura = document.getElementById('largura');
    const tvProfundidade = document.getElementById('profundidade');
    const btnPause = document.getElementById('pause');
    const btnReset = document.getElementById('reset');
    const velo = document.getElementById('velo');

    let nodeslist = [];
    let nodeshelp = [];
    let edgelist = [];
    let count = 0;

    const graph = new Graph(nodeslist, nodeshelp, edgelist);

    /* 
        SETA VELOCIDADE DA ANIMAÇÃO
    */
    velo.addEventListener('change', function() {
        graph.setVelo(velo.value)
    })

    /*
        REMOVE SETAS AOS VÉRTICES DO GRAFO.
        TRANSFORMA GRAFO ORIENTADO EM NÃO ORIENTADO
    */
    grafoOrientado.addEventListener('change', function() {
        
        let edgelist = [];
        let edgesValue = dataset.value.split('\n');

        graph.nodeslist.forEach(function(node) {
            node.resetNeighbor();
        })

        edgesValue.forEach(function(elem) {
            if (elem.length > 1) 
            {
                let edge = elem.split(' ');

                if (edge.length == 2 && edge[edge.length-1] != '') 
                {            
                    edgelist.push({from: graph.nodehelper.indexOf(edge[0]) + 1, to: graph.nodehelper.indexOf(edge[1]) + 1, arrows: 'to', color: {color: "#000"}});
        
                    graph.nodeslist[graph.nodehelper.indexOf(edge[0])].connect(graph.nodeslist[graph.nodehelper.indexOf(edge[1])]);
                }
            }    
        })
        graph.changeEdges(edgelist);
        graph.oriented = true;
        console.log("Grafo Orientado checked")
        console.log(graph)
    })

    /*
        ADICIONA SETAS AOS VÉRTICES DO GRAFO.
        TRANSFORMA GRAFO NÃO ORIENTADO EM ORIENTADO
    */
    grafoNaoOrientado.addEventListener('change', function() {
        
        let edgelist = [];
        let edgesValue = dataset.value.split('\n');

        graph.nodeslist.forEach(function(node) {
            node.resetNeighbor();
        })


        edgesValue.forEach(function(elem) {
            if (elem.length > 1) 
            {
                let edge = elem.split(' ');
                
                if (edge.length == 2 && edge[edge.length-1] != '') 
                {            
                    if (graph.nodeslist[graph.nodehelper.indexOf(edge[0])].neighbor.indexOf(graph.nodeslist[graph.nodehelper.indexOf(edge[1])]) == -1 || graph.nodeslist[graph.nodehelper.indexOf(edge[1])].neighbor.indexOf(graph.nodeslist[graph.nodehelper.indexOf(edge[0])]) == -1) {
                        
                        edgelist.push({from: graph.nodehelper.indexOf(edge[0]) + 1, to: graph.nodehelper.indexOf(edge[1]) + 1, arrows: 'undefined', color: {color: "#000"}});
                        
                        graph.nodeslist[graph.nodehelper.indexOf(edge[0])].connect(graph.nodeslist[graph.nodehelper.indexOf(edge[1])]);
                        graph.nodeslist[graph.nodehelper.indexOf(edge[1])].connect(graph.nodeslist[graph.nodehelper.indexOf(edge[0])]);
                    }
                }
            }
    
        })

        graph.changeEdges(edgelist);
        graph.oriented = false;
        console.log("Grafo Orientado checked")
        console.log(graph)
    })

    /*
        CRIA O GRAFO APÓS QUALQUER MUDANÇA NO INPUT
    */
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

                if (edge.length == 2 && edge[edge.length-1] != '') 
                {
                    if (grafoOrientado.checked) 
                    {               
                        edgelist.push({from: nodeshelp.indexOf(edge[0]) + 1, to: nodeshelp.indexOf(edge[1]) + 1, arrows: 'to', color: {color: "#000"}});
    
                        graph.nodeslist[nodeshelp.indexOf(edge[0])].connect(graph.nodeslist[nodeshelp.indexOf(edge[1])]);
                        graph.oriented = true;
                    } 
                    else if (grafoNaoOrientado.checked) 
                    {
                        if (graph.nodeslist[nodeshelp.indexOf(edge[0])].neighbor.indexOf(graph.nodeslist[nodeshelp.indexOf(edge[1])]) == -1 && graph.nodeslist[nodeshelp.indexOf(edge[1])].neighbor.indexOf(graph.nodeslist[nodeshelp.indexOf(edge[0])]) == -1) {
                            
                            edgelist.push({from: nodeshelp.indexOf(edge[0]) + 1, to: nodeshelp.indexOf(edge[1]) + 1, arrows: 'undefined', color: {color: "#000"}});
                            
                            graph.nodeslist[nodeshelp.indexOf(edge[0])].connect(graph.nodeslist[nodeshelp.indexOf(edge[1])]);
                            graph.nodeslist[nodeshelp.indexOf(edge[1])].connect(graph.nodeslist[nodeshelp.indexOf(edge[0])]);
                        }
                        graph.oriented = false;
                    }
                }
            }

            console.log(graph.nodeslist)

        });

        graph.setNodes(nodeslist);
        graph.setNodeHelper(nodeshelp);
        graph.setEdges(edgelist);

        graph.createNetwork(grafo);

    });

    tvLargura.addEventListener('click', function() {

        grafoNaoOrientado.disabled = true;
        grafoOrientado.disabled = true;
        dataset.disabled = true;
        startNode.disabled = true;
        velo.disabled = true;
        tvProfundidade.disabled = true;

        let frontier = [];
        let exploreds = [];

        console.log(graph)
        let interval = setInterval(function() {
            const helper = graph.getNodeHelper();

            // Pinta nós de Branco
            if (count < graph.nodes.length) {
                
                if (typeof graph.nodes[count].color.background == "undefined" || graph.nodes[count].color.background == '#97C2FC') 
                {
                    graph.setNodesColor("#FFF", graph.nodes[count].id - 1)
                }
            }

            // TP Largura
            if (count >= graph.nodes.length && helper.indexOf(startNode.value) > -1) 
            {
                let tvCount = count - graph.nodes.length;
                let current;
                console.log(tvCount)

                // SE NÓ AINDA NAO É PRETO E NAO ESTA EM LISTA FRONTEIRA
                if (graph.nodeslist[helper.indexOf(startNode.value)].color == "#FFF" && frontier.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1) {
                    frontier.push(graph.nodeslist[helper.indexOf(startNode.value)]);
                }
                
                // PROCURA POR NÓS BRANCOS
                if (frontier.length == 0) {

                    if (graph.nodeslist[tvCount].color == "#FFF") {
                        frontier.push(graph.nodeslist[tvCount]);
                        count = graph.nodes.length - 1; 
                    }
                }

                if (frontier.length != 0) {
                    if (tvCount < frontier[0].neighbor.length) 
                    {   
                        if (frontier[0].neighbor[tvCount].color == "#FFF") {
                            
                            graph.setNodesColor("#CCC", frontier[0].neighbor[tvCount].id - 1);
                            frontier.push(frontier[0].neighbor[tvCount])
                        }
                    }
                }

                if (frontier.length != 0) {

                    if (tvCount == frontier[0].neighbor.length && frontier[0].color != "#000") {
                        console.log("Fim dos vizinhos");
                        graph.setNodesColor("#000", frontier[0].id - 1);
    
                        //explorados.innerHTML += `${frontier[0].label} `
    
                        current = frontier.shift();
                        exploreds.push(current);
                        console.log("Fronteira", frontier)
                        console.log("Current: ", current);
                        console.log("Nos explorados:", exploreds)

                        explorados.innerHTML += `${current.label} `;
    
                        count = graph.nodes.length - 1;
                    }
                }

                if (frontier.length != 0) {
                    console.log("Fronteira zerada: ", frontier)
                    if (frontier[0].neighbor.length == 0 && tvCount == 1) {

                        console.log("Nó não tem vizinhos")
                        graph.setNodesColor("#000", frontier[0].id - 1);
                        //explorados.innerHTML += `${frontier[0].label} `
    
                        current = frontier.shift();
                        exploreds.push(current);
                        console.log("Fronteira", frontier)
                        console.log("Current: ", current);
                        console.log("Nos explorados:", exploreds)

                        explorados.innerHTML += `${current.label} `;
    
                        count = graph.nodes.length - 1;
                        tvCount--;
                    }
                }

            }

            // TESTA SE TODOS OS NÓS JÁ FORAM EXPLORADOS
                
            let fim = 0;
            for(let i = 0; i<graph.nodeslist.length; i++) {

                if (graph.nodeslist[i].color == "#000") 
                {
                    fim++
                }
            }
            console.log("FIM", fim);

            if (fim == graph.nodeslist.length) {
                explorados.innerHTML += '<br> FIM';
                exploreds = [];
                count = 0;
                current = 'undefined';
                graph.stop(interval);
            }

            
            if (count == graph.nodeslist.length && fim != graph.nodeslist.length) {
                count = graph.nodes.length;
            }
            count++;
        }, graph.animationVelo);
        console.log(graph.animationVelo)
        graph.setAnimation(interval)

    });

    tvProfundidade.addEventListener('click', function() {

        grafoNaoOrientado.disabled = true;
        grafoOrientado.disabled = true;
        dataset.disabled = true;
        startNode.disabled = true;
        velo.disabled = true;
        tvLargura.disabled = true;

        let pilha = [];
        let explored = [];
        
        let interval = setInterval(function() {
            const helper = graph.getNodeHelper();

            // Pinta nós de Branco
            if (count < graph.nodes.length) {
                
                if (typeof graph.nodes[count].color.background == "undefined" || graph.nodes[count].color.background == '#97C2FC') 
                {
                    graph.setNodesColor("#FFF", graph.nodes[count].id - 1)
                }
            }

            // TP Profundidade
            if (count >= graph.nodes.length && helper.indexOf(startNode.value) > -1) 
            {
                let tvCount = count - graph.nodes.length;
                console.log(tvCount)
                let current;

                /*
                    ADICIONA NÓ INICIAL NA PILHA
                */
                if (pilha.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1 && explored.indexOf(graph.nodeslist[helper.indexOf(startNode.value)]) == -1) 
                {
                    pilha.push(graph.nodeslist[helper.indexOf(startNode.value)]);
                    graph.setNodesColor("#CCC", graph.nodeslist[helper.indexOf(startNode.value)].id - 1);
                    
                }
                /*
                    SE PILHA VAZIA BUSCA POR NÓS INEXPLORADOS
                */
                if (pilha.length == 0) {
                    console.log("Pilha vazia");
                    if (graph.nodeslist[tvCount].color == "#FFF") {
                        pilha.push(graph.nodeslist[tvCount]);
                        count = graph.nodes.length - 1; 
                    }
                }

                console.log("Pai:", pilha[0])

                /*
                    ADICIONA VIZINHOS NA PILHA
                */
                if (pilha.length != 0) {
                    if (pilha[0].neighbor.length > 0){
                        
                        console.log(pilha[0].neighbor[tvCount])
                        if (pilha[0].neighbor[tvCount].color == "#FFF") 
                        {
                            graph.setNodesColor("#CCC", pilha[0].neighbor[tvCount].id - 1);
                            pilha.unshift(pilha[0].neighbor[tvCount])
                            
                            count = count = graph.nodes.length - 1;
                        }

                        else if (graph.oriented) 
                        {
                            if (pilha[0].neighbor[tvCount].color == "#000" && typeof pilha[0].neighbor[tvCount + 1] == 'undefined') 
                            {
                                graph.setNodesColor("#000", pilha[0].id - 1);
                                count = count = graph.nodes.length - 1;
                            
                                explored.push(pilha[0]);
                                current = pilha.shift()
                                console.log("Nó com filho explorado terminado: ", current)

                                explorados.innerHTML += `${current.label} `;
                            }
                        }

                        else if (!graph.oriented) {
                            if ((pilha[0].neighbor[tvCount].color == "#000" || pilha[0].neighbor[tvCount].color == "#CCC") && typeof pilha[0].neighbor[tvCount + 1] == 'undefined') 
                            {
                                graph.setNodesColor("#000", pilha[0].id - 1);
                                count = count = graph.nodes.length - 1;
                            
                                explored.push(pilha[0]);
                                current = pilha.shift()
                                console.log("Nó com filho explorado terminado: ", current)

                                explorados.innerHTML += `${current.label} `;
                            }
                        }
                    } 
                }

                /* 
                    PINTA NÓ DE PRETO SE NÃO TIVER VIZINHOS
                */
                if (pilha.length != 0) {
                    if (pilha[0].neighbor.length == 0) 
                    {
                        graph.setNodesColor("#000", pilha[0].id - 1);
                        count = count = graph.nodes.length - 1;

                        explored.push(pilha[0]);
                        current = pilha.shift()
                        console.log("Nó explorado: ", current)

                        explorados.innerHTML += `${current.label} `;
                    }
                }
            }
            
            let fim = 0;
            for(let i = 0; i<graph.nodeslist.length; i++) {

                if (graph.nodeslist[i].color == "#000") 
                {
                    fim++
                }
            }
            console.log("FIM", fim);

            if (fim == graph.nodeslist.length) {
                explorados.innerHTML += '<br> FIM';
                exploreds = [];
                count = 0;
                current = 'undefined';
                graph.stop(interval);
            }
            console.log(count)
            count++;
        }, graph.animationVelo);
        
        graph.setAnimation(interval)
    });

    /*
    btnPause.addEventListener('click', function() {
        velo.disabled = false;

        console.log("animacao:", graph.animation)
        graph.stop(graph.animation)
    })
    */
    btnReset.addEventListener('click', function() {

        grafoNaoOrientado.disabled = false;
        grafoOrientado.disabled = false;
        dataset.disabled = false;
        startNode.disabled = false;
        velo.disabled = false;
        tvLargura.disabled = false;
        tvProfundidade.disabled = false;

        count = 0;

        graph.stop(graph.animation)

        graph.nodes.forEach(function(node) {
            graph.setNodesColor("#97C2FC", node.id - 1)
        })

        explorados.innerHTML = '';
        console.log(graph)
        console.log('Grafo resetado');

    })

})