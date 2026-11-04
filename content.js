window.PORTFOLIO = {
  neuro: {
    title: 'Neuroscience', accent: '#d3aec9',
    projects: [
      {title:'Neural decoding & spiking representations',year:'2026',context:'Research internship · Institute of Neuroinformatics',description:'Worked with high-dimensional neural spike data from a primate grasping dataset to decode continuous movement.',details:['Benchmarked temporal decoders for continuous kinematics.','Evaluated a spiking autoencoder trained with Differentiated Target Propagation against PCA and raw features.'],tools:'Neural data · Spiking autoencoders · Temporal decoding'},
      {title:'Generative EEG embeddings',year:'2026',context:'Research project · ETH Zurich',description:'Used model parameters to study muscarinic neuromodulation of the mismatch-negativity circuit.',details:['Applied Bayesian dynamic causal modelling to EEG event-related potentials.','Used the inferred parameters to build an individual-level classifier.'],tools:'EEG · Dynamic causal modelling · Bayesian inference'},
      {title:'FaceAge',year:'2024',context:'Psychology lab · University of Sydney',description:'Decoded age-related information from EEG and compared neural and vision-model representations over time.',details:['Aligned EEG preprocessing and epochs with behavioural metadata, then used block-aware cross-validation for time-resolved decoding to reduce leakage.','Compared cohort-averaged neural dissimilarity matrices with CORnet-style vision models using permutation-based representational similarity analysis.'],tools:'MATLAB · EEGLAB · RSA · Parallel computing'},
      {title:'Brain Explorer',year:'2026',context:'Personal',description:'A 3D atlas connecting brain anatomy with region functions, learning mechanisms, and linked scientific literature.',tools:'JavaScript · Three.js · Scientific visualization',links:[{label:'Explore the atlas',url:'https://lacha25.github.io/brain-explorer/'},{label:'Source code',url:'https://github.com/lacha25/brain-explorer'}]}
    ]
  },
  serious: {
    title: 'Serious projects', accent: '#b9dbd6',
    projects: [
      {title:'AI Scientist Harness & Benchmark',year:'2026 · ongoing',context:'ETH Zurich',description:'Developing an agent harness for the mechanical engineering department, with an exam-based evaluation pipeline.',tools:'AI agents · Evaluation · Research tooling'},
      {title:'Polymarket',context:'Personal',description:'A research project analysing Polymarket prediction markets and testing trading strategies in simulation.',details:['Processed price and order-book events through an asynchronous event queue.','Modelled limit-order fills, trading fees, and spreads in a simulated broker.'],tools:'Python · asyncio · WebSockets · NumPy'},
      {title:'Gipfelsturm LLM Training Challenge',year:'2026',context:'ETH Zurich · CSCS',description:'Explored the trade-offs of training 125M–8B parameter models with Megatron-LM under a 30-minute compute budget.',details:['Compared microbatch sizes, numerical precision, dataloader workers, and gradient checkpointing.','Used Chinchilla scaling laws to reason about compute allocation.'],tools:'Megatron-LM · Distributed training · Benchmarking'},
      {title:'Alpine Guard',year:'2025',context:'A team prototype · Swiss AI Hackathon',description:'Exploring Swiss glaciers and estimating risk. I contributed to the Python backend and machine learning risk-model pipeline.',tools:'Python · FastAPI · scikit-learn · Geospatial data',links:[{label:'View the project',url:'https://github.com/eliemada/swiss-ai-hackathon-25'}]},
      {title:'Image filesystem',year:'2024',context:'EPFL',description:'An image store built around a custom .imgfs format, with command-line and HTTP interfaces.',details:['Used a versioned header and fixed metadata table with SHA-256 deduplication and thumbnail generation on demand.','Served concurrent HTTP requests using sockets, pthreads, and mutex-protected shared state.'],tools:'libvips · OpenSSL · pthreads · HTTP'},
      {title:'Fashion-MNIST classification',year:'2024',context:'EPFL · 2nd out of 133',description:'Compared CNNs, multilayer perceptrons, and Vision Transformers with data augmentation and architecture and optimizer sweeps.',tools:'Deep learning · Image classification · Model selection'},
      {title:'Live aircraft tracking',year:'2023',context:'A collaborative project · EPFL',description:'Decoding ADS-B aircraft broadcasts and displaying aircraft positions and trajectories on an interactive map.',tools:'Java · JavaFX · Signal processing',links:[{label:'View the project',url:'https://github.com/lacha25/flight-tracker-'}]}
    ]
  },
  fun: {
    title: 'Just for fun', accent: '#beb9e7',
    projects: [
      {title:'PubCrawl — Crawl App',year:'2024',context:'A team hackathon build',description:'A mobile app for planning a pub crawl, with an interactive map and directions between stops. I contributed to the map and route interface.',tools:'TypeScript · React Native · Expo',links:[{label:'View the project',url:'https://github.com/Crawl-App/app-frontend'}]},
      {title:'RunMap',year:'2026',context:'Personal',description:'A transit planner that compares walking and running connections while respecting vehicle timetables, with an interactive map and a Google Maps companion extension.',tools:'Python · JavaScript · Google Routes API',links:[{label:'View the project',url:'https://github.com/lacha25/Running-Routes'}]},
      {title:'wAI',year:'2025',context:'Personal',description:'A local tool for exploring sentiment, response times, and conversation patterns in Instagram message exports, using rule-based metrics and confidence indicators.',tools:'Python · Streamlit'},
      {title:'Cooking',year:'2025',context:'Personal',description:'A personal recipe manager for keeping recipes, cooking ideas, and techniques together, with a chat-based culinary assistant.',tools:'JavaScript · React · Node.js · Express'},
      {title:'Moment',year:'2023',context:'Personal',description:'Co-designing and developing a productivity app that rewards completed work blocks in-game to help build a regular work habit.',tools:'Kotlin · Jetpack Compose'},
      {title:'Cucumber Jump',year:'2023',context:'Personal',description:'A 2D mobile game where you rotate a cucumber through randomly assembled obstacle courses, collect coins, and unlock skins.',tools:'C# · Unity · 2D physics'}
    ]
  }
};
