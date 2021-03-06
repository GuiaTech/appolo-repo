folha.dashboard = {

    dummyObj: null ,
    
    config: {

        dash: [ 

            'event_return_splitter' , 
            'loadController' , 
            'listener' , 
            'adapter' , 
            'write' , 
            'before_write' , 
            'post_write' , 
            'transition' , 
            'fake_thread_controller' , 
            'url_controller' ,
            'paginator' ,
            'convert' ,
            'sort_by'
        ] ,

        consumer: [ 

            'event_return_splitter' , 
            'fake_thread_controller' 
        ] ,

        provider: [ 

            'fake_thread_controller' 
        ]
    } ,

    init: function ( newDash ) { 

        var self = this ,
            dummyObj ,
            consumers ;

        if ( !self.dummyObj ) {

            self.dummyObj = {} ;
            dummyObj = self.dummyObj ;
            dummyObj = self.builder( 'dash' ) ;
            dummyObj.consumers.consumer = self.builder( 'consumer' ) ;
            dummyObj.providers.provider = self.builder( 'provider' ) ;
        } else {

            dummyObj = self.dummyObj ;
        }

        folha[ newDash ] = inheritDeep( dummyObj ) ;
    } ,

    builder: function ( project ) {

        var self = this ,
            dummyObj = {} ,
            config = self.config ,
            genericObjects = self.genericObjects ,
            i ;

        dummyObj = $.extend( true , {} , self[ project ] ) ;

        for ( i = config[ project ].length - 1 ; i >= 0 ; i-- ) {
            
            if ( typeof genericObjects[ config[ project ][ i ] ] === 'object' && !$.isArray( genericObjects[ config[ project ][ i ] ] ) ) {

                dummyObj[ config[ project ][ i ] ] = $.extend( true , {} , genericObjects[ config[ project ][ i ] ] ) ;
            } else if ( $.isArray( genericObjects[ config[ project ][ i ] ] ) ) {

                dummyObj[ config[ project ][ i ] ] = $.extend( true , [] , genericObjects[ config[ project ][ i ] ] ) ;
            } else {

                dummyObj[ config[ project ][ i ] ] = genericObjects[ config[ project ][ i ] ] ;
            }
        }

        return dummyObj ;
    } ,

    dash: {

        chart: [

            'self_name' ,
            'url_vars' ,
            'url_splitters' ,
            'cookie_appendix' ,
            'cookie_expire_days' ,
            'failed_load_wait_time' ,
            'layout_current_provider' ,
            'dom_container'
        ] ,

        self_name: null ,
        url_vars: null ,
        url_splitters: null ,
        cookie_appendix: null ,
        cookie_expire_days: null ,
        failed_load_wait_time: null ,
        layout_current_provider: null ,
        dom_container: null ,

        config: {} ,

        consumers: {} ,

        providers: {} ,

        init: function ( config ) {

            var this_self = this ,
                consumers = this_self.consumers ,
                consumer = consumers.consumer ,
                config_consumers ,
                chart_selected ,
                layout ,
                i ;

            this_self.config = config ;

            // config dash
            this_self.set_by_chart( this_self , this_self.config.dash ) ;

            // config layout
            consumer.father_obj = this_self.self_name ;
            layout = consumers.layout = $.extend( true , {} , consumer ) ;
            this_self.set_by_chart( layout , this_self.config.layout ) ;
            layout.self = 'layout' ;
            layout.css.self = this_self.dom_container ;

            // config consumer common
            consumer.container_obj = layout.self ;
            consumer.css.real = layout.css.real ;
            consumer.css.imaginary = layout.css.imaginary ;
            consumer.css.loading = layout.css.loading ;

            // config consumer especifico
            config_consumers = this_self.config.consumers ;
            for ( i = config_consumers.chart.length - 1 ; i >= 0 ; i-- ) {

                chart_selected = config_consumers.chart[ i ] ;
                consumers[ chart_selected ] = $.extend( true , {} , consumer ) ;
                consumers[ chart_selected ].self = chart_selected ;;
                this_self.set_by_chart( consumers[ chart_selected ] , config_consumers[ chart_selected ] ) ;
            }

            // config provider common
            this_self.providers.provider.father_obj = this_self.self_name ;
            
            // instanciando controllers
            /*this_self.loadController.set( this_self.self_name ) ;

            this_self.url_vars && this_self.url_controller.set( this_self.self_name , this_self.url_vars , this_self.url_splitters ) ;

            this_self.cookie_appendix && this_self.cacheController.init( 
                this_self.self_name , 
                this_self.self_name + this_self.cookie_appendix , 
                this_self.cookie_expire_days 
            ) ;

            // utilizar url ou cache
            this_self.url_controller.init( this_self ) || this_self.cacheController.check() ;*/

            // chamando o layout
            layout.init( this_self.layout_current_provider ) ;
        } ,

        set_by_chart: function ( context , feed , chart , deep ) {

            var chart_selected ,
                i ;

            if ( deep !== false ) deep = true ;if(typeof feed === 'undefined')console.log(context,chart);

            chart = chart || feed.chart || context.chart ;

            if ( ! deep ) {

                for ( i = chart.length - 1 ; i >= 0 ; i-- ) {
                    
                    chart_selected = chart[ i ] ;
                    context[ chart_selected ] = feed[ chart_selected ] ;
                }
            } else {

                for ( i = chart.length - 1 ; i >= 0 ; i-- ) {
                    
                    chart_selected = chart[ i ] ;//console.log(JSON.stringify(feed));

                    if ( ! feed[ chart_selected ].chart ) {

                        context[ chart_selected ] = feed[ chart_selected ] ;
                    } else {

                        this.set_by_chart( context[ chart_selected ] , feed[ chart_selected ] , feed[ chart_selected ].chart ) ;
                    }
                }
            }

            return true ;
        } ,

        failed: function ( consumer , product ) {//var a = new Date();console.log('failed',a);
        
            /*var self = this ;

            setTimeout( function () {
                
                self.consumers[ consumer ].load( product ) ;
            } , self.failed_load_wait_time ) ;*/
        }
    } ,
        
    consumer: {

        chart: [

            'css' ,
            'events'
        ] ,
        
        self: null ,
        father_obj: null ,
        container_obj: null ,
        active: false ,
        active_product: null ,

        css: {

            chart: [

                'self' ,
                'inherit'
            ] ,

            self: null ,
            inherit: null ,
            real: null ,
            imaginary: null ,
            loading: null ,
            self_current: '' ,
            container_current: ''
        } ,

        events: {

            chart: [

                'target' ,
                'type' ,
                'selector' ,
                'selector_attr' ,
                'splitter'
            ] ,

            target: null ,
            type: null ,
            selector: null ,
            selector_attr: null ,
            splitter: null ,
            attached: null
        } ,

        products: {} ,
        
        init: function ( provider ) {
            
            if ( provider ) {
                
                this.active = true ;
                this.load( provider , true ) ;

                return true ;
            }

            return false ;
        } ,

        event_handler: function ( values ) {//console.log(this.self,values);

            this.load( values ) ;
        } ,

        load: function ( provider , first_load ) {
            
            var this_self = this ,
                self_name = this_self.self ,
                father_obj = folha[ this_self.father_obj ] ,
                product , 
                product_args = [] ,
                product_to_load ;

            if ( provider ) {

                product = father_obj.event_return_splitter( provider ) ;
                product_args = father_obj.event_return_splitter( provider , true ) ;
            }

            product_to_load = this_self.products[ product ] ;
            if ( ! product_to_load ) {

                product_to_load = this_self.products[ product ] = inheritDeep( father_obj.providers.provider ) ;
                product_to_load.consumer = this_self.self ;
                product_to_load.self = product ;
                father_obj.set_by_chart( product_to_load , father_obj.config.providers[ product ] ) ;
            }

            this_self.active_product = product ;
            product_to_load.load( product_args , first_load ) ;

            if ( this_self.events && this_self.events.target && this_self.events.target.length ) father_obj.listener.attach( this_self ) ;
        
            return true ;
        }
    } ,
        
    provider: {

        chart: [

            'reload' ,
            'json' ,
            'events' , 
            'transition' ,
            'to_write'
        ] ,

        self: null ,
        father_obj: null ,
        consumer: null ,
        reload: null ,

        json: {

            chart: [

                'url' ,
                'callback' ,
                'cache'
            ] ,
            
            url: null ,
            callback: null ,
            cache: null
        } ,

        events: {

            chart: [

                'target' ,
                'type' ,
                'selector' ,
                'selector_attr' ,
                'splitter'
            ] ,

            target: null ,
            type: null ,
            selector: null ,
            selector_attr: null ,
            splitter: null ,
            attached: null
        } ,
        
        transition: {

            chart: [

                'type' ,
                'init_type' ,
                'speed'
            ] ,

            type: null ,
            init_type: null ,
            speed: null ,
            current_type: null
        } ,
        
        data: [] ,

        to_write: null ,

        event_handler: function ( values ) {

            this.load( values ) ;
        } ,

        load: function ( args , first_load ) {

            var this_self = this ,
                json = this_self.json ,
                father_obj = folha[ this_self.father_obj ] ,
                consumer = father_obj.consumers[ this_self.consumer ] ,
                transition_type ;

            if ( ! folha.animating ) {

                this_self.transition.current_type = first_load ? this_self.transition.init_type : this_self.transition.type ;

                if ( typeof args === 'undefined' ) args = [] ;

                if ( first_load ) args.first_load = first_load ;

                if ( json.url && json.url.length && ( ! this_self.data || ! this_self.data.length ) ) {

                    this_self.get_jsons( json.url , json.callback , json.cache , args , true ) ;
                } else {

                    if ( this_self.transition.current_type ) {
                        
                        this_self.fake_thread_controller.on( [ 'transition' ] , function () {

                            father_obj.adapter( this_self.to_write , args , this_self ) ;
                        } ) ;
                    } else {

                        father_obj.adapter( this_self.to_write , args , this_self ) ;
                    }
                }

                if ( this_self.transition.current_type ) father_obj.transition[ this_self.transition.current_type ].begin( consumer , first_load ) ;

                return true ;
            } else {

                return false ;
            }
        } ,

        get_jsons: function ( urls , callbacks , cache , product_args , auto , force ) {

            var self = this ,
                selected_url ,
                selected_type ,
                urls_length ,
                mark = [] ,
                overflow_length_message = 'You tried to load more than 10 simultaneous requests, to do so you need to force it true, use at your own risk.' ,
                i ;

            if ( urls ) {

                urls_length = urls.length ;
            }

            if ( ! urls_length ) return false ;

            if ( urls_length > 10 && !force ) {

                console.log( overflow_length_message ) ;
                return overflow_length_message ;
            }

            mark = urls.slice() ;
            auto && mark.push( 'transition' ) ;
            self.fake_thread_controller.on( mark , function () {

                folha[ self.father_obj ].adapter( self.to_write , product_args , self ) ;
            } ) ;

            for ( i = urls_length - 1 ; i >= 0 ; i-- ) {

                if ( callbacks[ i ] ) {

                    selected_type = 'jsonp' ;
                } else {

                    selected_type = 'json' ;
                }

                selected_url = urls[ i ] ;

                $.ajax( {

                    cache: cache[ i ] ,
                    url: selected_url ,
                    dataType: selected_type ,
                    jsonpCallback: callbacks[ i ] ,

                    beforeSend: function () {

                        this.index_url = i ;
                        this.selected_url = selected_url ;
                    } ,

                    success: function ( data , textStatus , jqXHR ) {

                        self.data[ this.index_url ] = data ;
                        self.fake_thread_controller.check( this.selected_url ) ;
                    } , 

                    error: function ( jqXHR , textStatus , errorThrown ) {
                        //self.data[ this.index_url ] = [ jqXHR , textStatus , errorThrown ] ;
                    } , 

                    complete: function () {

                        //fake_thread_controller.check( this.selected_url ) ;
                    }
                } ) ;
            }

            return true ;
        }
    } , 

    genericObjects: {

        /**
        * Fun��es de compara��o para se usar com o sort(), ex: meu_array.sort( dashboard.sort_by.object.property_value( array_obj , property , asc , case_sensitive ) )
        *
        * @class sort_by
        * @constructor none
        */
        sort_by: { 

            /**
            * Fun��es de compara��o para um array de objetos.
            *
            * @class object
            * @constructor none
            */
            object: {

                /**
                * Compara propriedades de objetos por valor.
                *
                * @method property_value
                * @param {String} property Nome da propriedade a ser comparada
                * @param {Number} asc Valor para ascendente(1) ou descendente(-1), default = 1
                * @param {Number} case_sensitive Valor para ser case sensitive(1) ou insensitive(-1), default = 1
                * @return {Array} Retorna valores utilizados pelo sort, ex: 1, 0, -1;
                */
                property_value: function ( property , asc , case_sensitive ) {

                    if ( typeof property !== 'string' ) return array_obj ;

                    if ( asc !== -1 && asc !== 1 ) asc = 1 ;
                    if ( case_sensitive !== -1 && case_sensitive !== 1 ) case_sensitive = 1 ;

                    if ( case_sensitive ) {

                        return function ( a , b ) {

                            a = a[ property ] ;
                            b = b[ property ] ;

                            return a == b ? 0 : ( a < b ? ( -1 * asc ) : asc ) ;
                        } ;
                    } else {

                        return function ( a , b ) {

                            a = a[ property ] ;
                            b = b[ property ] ;

                            return a.toLowerCase() == b.toLowerCase() ? 0 : ( a.toLowerCase() < b.toLowerCase() ? ( -1 * asc ) : asc ) ;
                        } ;
                    }
                }
            }
        } ,

        /**
        * Conversores
        *
        * @class converter
        * @constructor none
        */
        convert: { 

            /**
            * Conversores de datas.
            *
            * @class date
            * @constructor none
            */
            date: {

                /**
                * Data de timestamp("2010-06-09 13:12:01") para...
                *
                * @class timestamp_to
                * @constructor none
                */
                timestamp_to: {

                    /**
                    * Transforma uma string de timestamp("2010-06-09 13:12:01") para data no formato brasileiro("01/05/2010").
                    *
                    * @method brazil_date
                    * @param {String} timestamp_date data no formato timestamp, ex: "2010-06-09 13:12:01"
                    * @param {String} splitter O que ser� inserido entre cada valor , default '/'
                    * @return {String} Retorna string formatado, ex: "19/02/2012" , "01/05/2010" , "20-12-2001" , "20,12,2001"
                    */
                    brazil_date: function ( timestamp_date , splitter ) {

                        if ( typeof timestamp_date !== 'string' ) return timestamp_date ;

                        splitter = splitter || '/' ;

                        var new_date = timestamp_date.split( /[- :]/ ) ;

                        return [ new_date[ 2 ] , splitter , new_date[ 1 ] , splitter , new_date[ 0 ] ].join( '' ) ;
                    }
                }
            }
        } ,

        /**
        * Paginador
        *
        * @class paginator
        * @constructor none
        */
        paginator: { 

            /**
            * Menssagens de erro.
            * 
            * @property limit_error_message
            * @type {String}
            * @default "Parameter limit must be >= 1."
            *
            * @property index_error_message
            * @type {String}
            * @default "Parameter index must be >= 1 or <= pages length."
            */
            limit_error_message: 'Parameter limit must be >= 1.' ,
            index_error_message: 'Parameter index must be >= 1 and <= pages length.' ,

            /**
            * Transforma um array de resultados num array bidimencional, onde cada indice um array com os resultados da pagina.
            *
            * @method format
            * @param {Array} data Resultados ex: [ {x:'a',y:'b',z:'c'} , {...} , {...} , {x:'p',y:'o',z:'y'} , {...} , {...} , ... ]
            * @param {Number} limit O tamanho da parcela que compoe cada pagina, >= 1
            * @return {Array} Retorna array formatado, ex: [ [ {x:'a',y:'b',z:'c'} , {...} , {...} ] , [ {x:'p',y:'o',z:'y'} , {...} , {...} ] , ... ]
            */
            format: function ( data , limit ) {

                if ( limit < 1 ) {

                    console.log( this.limit_error_message ) ;
                    return data ;
                }

                var new_data = [] ,
                    i ,
                    i_max = Math.ceil( data.length / limit ) ,
                    parcel ;

                for ( i = 0 ; i < i_max ; i++ ) {
                    
                    parcel = i * limit ;
                    new_data[ i ] = data.slice( parcel , parcel + limit ) ;
                }

                return new_data ;
            } ,

            /**
            * Gera a paginacao pronta para ser inserida/concatenada com o html, ex: [ 1 , 2 , 3 , 4 , 5 , ... ] .
            *
            * @method simple
            * @param {Array} data_paginated Resultados ja paginados
            * @return {Array} Retorna array formatado
            */
            simple: function ( data_paginated ) {

                var paginated = [] ,
                    i ,
                    i_max ;

                for ( i = paginated.length , i_max = data_paginated.length + i ; i < i_max ; paginated[ i ] = ++i ) ;

                return paginated ;
            } ,

            /**
            * Gera a paginacao pronta para ser inserida/concatenada com o html.
            * Retorna array formatado com primeiro e ultimos indices sendo a pagina anterior e proxima,
            * no caso do index ser a primeira ou ultima pagina false sera o valor no indice.
            * Supondo index 5 ex: [ 4 , ... , 3 , 4 , 5 , 6 , 7 , ... , 6 ] ,
            * supondo index 1 ex: [ false , 1 , 2 , 3 , ... , 2 ] .
            *
            * @method simple_next
            * @param {Array} data_paginated Resultados ja paginados
            * @param {Number} index Pagina corrente, >= 1 e <= numero de paginas
            * @return {Array} Retorna array formatado
            */
            simple_next: function ( data_paginated , index ) {

                if ( index < 1 || index > data_paginated.length ) {

                    console.log( this.index_error_message ) ;
                    return false ;
                }

                var paginated = [] ,
                    i ,
                    i_max ;

                paginated[ paginated.length ] = ( index > 1 ) ? index - 1 : false ;

                for ( i = paginated.length , i_max = data_paginated.length + i ; i < i_max ; paginated[ i ] = i++ ) ;

                paginated[ paginated.length ] = ( index < data_paginated.length ) ? index + 1 : false ;

                return paginated ;
            } ,

            /**
            * Gera a paginacao pronta para ser inserida/concatenada com o html.
            * Retorna array formatado com primeiro e ultimos indices sendo a pagina anterior e proxima,
            * no caso do index ser a primeira ou ultima pagina false sera o valor no indice.
            * Sao sempre 5 paginas, o index se adequa mas a tendencia eh o centro.
            * Supondo index 9 ex: [ 8 , 7 , 8 , 9 , 10 , 11 , 10 ] ,
            * supondo index 1 ex: [ false , 1 , 2 , 3 , 4 , 5 , 2 ] .
            *
            * @method fol_default
            * @param {Array} data_paginated Resultados ja paginados
            * @param {Number} index Pagina corrente, >= 1 e <= numero de paginas
            * @return {Array} Retorna array formatado
            */
            fol_default: function ( data_paginated , index ) {

                if ( index < 1 || index > data_paginated.length ) {

                    console.log( this.index_error_message ) ;
                    return false ;
                }

                var paginated = [] ,
                    i ,
                    i_max ;

                paginated[ paginated.length ] = ( index > 1 ) ? index - 1 : false ;

                switch ( true ) {

                    case ( data_paginated.length < 6 ):

                        for ( i = paginated.length , i_max = data_paginated.length + i ; i < i_max ; paginated[ i ] = i++ ) ;
                        break;
                    case ( index < 3 ):

                        for ( i = paginated.length , i_max = 5 + i ; i < i_max ; paginated[ i ] = i++ ) ;
                        break;
                    case ( index > data_paginated.length - 2 ):

                        for ( i = data_paginated.length - 4 , i_max = data_paginated.length + 1 ; i < i_max ; paginated[ paginated.length ] = i++ ) ;
                        break;
                    default:
                        
                        for ( i = index - 2 , i_max = index + 3 ; i < i_max ; paginated[ paginated.length ] = i++ ) ;
                }

                paginated[ paginated.length ] = ( index < data_paginated.length ) ? index + 1 : false ;

                return paginated ;
            }
        } ,

        /**
        * Separa o nome do provider de seus argumentos quando recebido no load do consumidor.
        *
        * @method event_return_splitter
        * @param {Array} content provider no primeiro indice, seguido de "n" argumentos
        * @param {String} content considera que � o provider
        * @param {Boolean} true para os argumentos, false para provider, default false
        * @return {Array} Retorna argumentos
        * @return {String} Retorna provedor
        */
        event_return_splitter: function ( content , is_args ) {

            var first_content ,
                args_content ;

            if ( $.isArray( content ) ) {
                            
                first_content = content[ 0 ] ;
                
                if ( content.length > 1 ) {
                    
                    args_content = content.slice( 1 ) ;
                }
            } else {
                
                first_content = content ;
            }
            
            if ( is_args ) {

                return args_content ;
            } else {

                return first_content ;
            }
        } ,

        /**
        * Fun��es para lidar com cookies.
        *
        * @class cacheController
        * @constructor none
        */
        // FIXME:2012-09-12:thiago.morelli:N�o sofreu manuten��o a partir da vers�o 0.1
        cacheController: {
        
            father_obj: null ,

            active: false ,
            
            init: function ( father_obj , cookieName , cookie_expire_days ) {
                
                var self = this ,
                    cacheLaborer = self.cacheLaborer ;
                
                self.active = true ;
                self.father_obj = father_obj ;
                cacheLaborer.father_obj = father_obj ;
                cacheLaborer.cookieName = cookieName ;
                cacheLaborer.cookie_expire_days = cookie_expire_days ;
            } , 
            
            check: function ( layout , setting ) {
                
                var self = this ;
                    
                if ( !self.active ) return ;

                if ( self.cacheLaborer.cookieDefined() ) {
                    
                    if ( layout ) {

                        self.update( layout ) ;
                        self.set( setting ) ;
                        
                        return true ;
                    } else {
                    
                        self.set() ;
                    
                        return true ;
                    }
                } else {
                    
                    self.update( '' , true );
                    
                    return false ;
                }
            } ,
            
            update: function ( layout , newCookie ) {
                
                var self = this ,
                    cacheLaborer = self.cacheLaborer ,
                    name ,
                    value ,
                    days ;
                
                if ( !self.active ) return ;

                name = cacheLaborer.cookieName ;
                days = cacheLaborer.cookie_expire_days ;
                
                if ( newCookie ) {
                    
                    value = cacheLaborer.newCookie() ;
                } else if ( layout ) {
                    
                    value = cacheLaborer.updateCookie( layout ) ;
                } else {
                    
                    value =cacheLaborer.updateCookie() ;
                }
                
                cacheLaborer.parser.writeCookie( name , value , days ) ;
            } , 
            
            set: function ( urlSetting ) {
                
                var self = this ,
                    father_obj = self.father_obj ,
                    folhaObj = folha[ father_obj ] ,
                    cache ,
                    lastView ,
                    consumerId ,
                    cacheLayoutsSetting ,
                    i ,
                    j ;

                if ( !self.active ) return ;
                
                cache = self.cacheLaborer.getCookie() ;
                lastView = urlSetting ? urlSetting.layout : cache.layoutLastView ;
                folhaObj.content = lastView ;
                consumerId = folhaObj.layouts[ lastView ].consumerId ;
                providerId = folhaObj.layouts[ lastView ].providerId ;
                
                if ( urlSetting ) {

                    cacheLayoutsSetting = urlSetting.setting ;
                } else {

                    for ( i = cache.layouts.length - 1 ; i >= 0 ; i-- ) {
                        
                        if ( cache.layouts[ i ].layout == lastView ) {
                            
                            cacheLayoutsSetting = cache.layouts[ i ].setting ;
                            break ;
                        }
                    }

                    if ( i === -1 ) return null ;
                }
                
                for ( i = cacheLayoutsSetting.length - 1 ; i >= 0 ; i-- ) {
                    
                    for ( j = consumerId.length - 1 ; j >= 0 ; j-- ) {
                        
                        if( providerId[ j ] && consumerId[ j ] == cacheLayoutsSetting[ i ].consumer ) {
                            
                            providerId[ j ] = cacheLayoutsSetting[ i ].product ;
                            
                            break ;
                        }
                    }
                    
                }
                
                return true ;
            } ,
            
            cacheLaborer: {
                
                father_obj: null ,
                
                cookieName: null ,
            
                cookie_expire_days: null ,
                
                cookieDefined: function () {
                    
                    var self = this ;
                    
                    if ( self.parser.readCookie( self.cookieName ) ) {
                        
                        return true ;
                    } else {
                        
                        return false
                    }
                } ,
                
                newCookie: function () {
                
                    var self = this ,
                        toReturn ,
                        layouts ,
                        layoutLastView ;
                        
                        toReturn = {} ;
                        layoutLastView = toReturn.layoutLastView = folha[ self.father_obj ].content ;
                        layouts = toReturn.layouts = [] ;
                        layouts[ 0 ] = {} ;
                        layouts[ 0 ].layout = layoutLastView ;
                        layouts[ 0 ].setting = [] ;
                        
                    return JSON.stringify( toReturn ) ;
                } ,
                
                getCookie: function () {
                    
                    var self = this ;
                    
                    return JSON.parse( self.parser.readCookie( self.cookieName ) ) ;
                } ,
                
                updateCookie: function ( layout ) {
                    
                    var self = this ,
                        folhaObj = folha[ self.father_obj ] ,
                        setting = folhaObj.loadController.setting ,
                        toReturn = self.getCookie() ,
                        layouts ,
                        layoutSelected ,
                        layoutSetting ,
                        layoutSettingSelected ,
                        layoutLastView = toReturn.layoutLastView ,
                        i ;
                    
                    if ( layout ) {
                        
                        toReturn.layoutLastView = layout ;
                        
                        return JSON.stringify( toReturn ) ;
                    } else {
                        
                        layoutLastView = folhaObj.content ;
                    }
                    
                    layouts = toReturn.layouts ;

                    for ( i = layouts.length - 1 ; i >= 0 ; i-- ) {
                        
                        if ( layouts[ i ].layout == layoutLastView ) {
                            
                            break ;
                        }
                    }
                    
                    ( i === -1 ) && ( i = layouts.length ) ;
                    
                    layoutSelected = layouts[ i ] = {} ;
                    layoutSelected.layout = layoutLastView ;
                    layoutSetting = layoutSelected.setting = [] ;
                    
                    for ( i = setting.length - 1 ; i >= 0 ; i-- ) {

                        layoutSettingSelected = layoutSetting[ i ] = {} ;
                    
                        layoutSettingSelected.consumer = setting[ i ].consumer ;
                        layoutSettingSelected.product = setting[ i ].product ;
                    }
                    
                    return JSON.stringify( toReturn ) ;
                } ,
                
                parser: {
                
                    writeCookie: function ( name , value , days ) {
                    
                        if ( days ) {
                            var date = new Date() ;
                            date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000) ) ;
                            var expires = "; expires=" + date.toGMTString() ;
                        }
                        
                        else var expires = "" ;
                        document.cookie = name + "=" + value + expires + "; path=/" ;
                    } , 
                    
                    readCookie: function ( name ) {
                        
                        var nameEQ = name + "=" ;
                        var ca = document.cookie.split( ';' ) ;
                        
                        for (var i = 0 ; i < ca.length ; i++ ) {
                            var c = ca[ i ] ;
                            while ( c.charAt( 0 ) == ' ' ) c = c.substring( 1 , c.length ) ;
                            if ( c.indexOf( nameEQ ) == 0 ) return c.substring( nameEQ.length , c.length ) ;
                        }
                        
                        return null ;
                    } , 
                    
                    eraseCookie: function ( name ) {
                        
                        var self = this ;
                        
                        self.writeCookie( name , "" , -1 ) ;
                    }
                }
            }
        } ,

        /**
        * Fun��es para lidar com url, tanto campo search como hash.
        *
        * @class url_controller
        * @constructor none
        */
        // FIXEME:2012-09-12:thiago.morelli:Com exce��o dos m�todos com coment�rios, os demais n�o foram atualizados da vers�o 0.1
        url_controller: {

            father_obj: null ,
            location_type: 'hash' ,
            url_vars: [] ,
            url_splitters: [] ,
            active: false ,

            set: function ( father_obj , url_vars , url_splitters ) {

                var self = this ;

                self.father_obj = father_obj ;
                self.url_vars = url_vars ;
                self.url_splitters = url_splitters ;
                self.active = true ;
            } ,

            parseToSystem: function ( dummySetting ) {

                var dummySettingParsed = {} ,
                    dummySettingParsedSelected ,
                    i ,
                    iMax ;

                dummySettingParsed.layout = dummySetting.layout[ 0 ] ;
                dummySettingParsed.setting = [] ;

                for ( i = 0 , iMax = dummySetting.consumer.length ; i < iMax ; i++ ) {
                
                    dummySettingParsedSelected = dummySettingParsed.setting[ i ] = {} ;
                    dummySettingParsedSelected.consumer = dummySetting.consumer[ i ] ;
                    dummySettingParsedSelected.product = dummySetting.provider[ i ] ;
                }

                return dummySettingParsed ;
            } , 

            parseToUrl: function ( setting ) {

                var self = this ,
                    url_vars = self.url_vars ,
                    url_splitters = self.url_splitters ,
                    settingSelected ,
                    dummyUrl = [] ,
                    dummyConsumer = [] ,
                    dummyProvider = [] ,
                    url_splitters0 = url_splitters[ 0 ] ,
                    url_splitters1 = url_splitters[ 1 ] ,
                    i ,
                    iMax ;

                dummyUrl[ 0 ] = [ url_vars[ 0 ] , folha[ self.father_obj ].content ].join( url_splitters1 ) ;

                for ( i = 0 , iMax = setting.length ; i < iMax ; i++ ) {
                    
                    settingSelected = setting[ i ] ;
                    dummyConsumer[ i ] = settingSelected.consumer ;
                    dummyProvider[ i ] = settingSelected.product ;
                }

                dummyUrl[ 1 ] = [ url_vars[ 1 ] , dummyConsumer.join( url_splitters0 ) ].join( url_splitters1 ) ;
                dummyUrl[ 2 ] = [ url_vars[ 2 ] , dummyProvider.join( url_splitters0 ) ].join( url_splitters1 ) ;

                return dummyUrl.join( url_splitters[ 2 ] ) ;
            } , 

            init: function () {

                if ( !this.active ) return false ;

                var self = this ,
                    cache_controller = folha[ self.father_obj ].cacheController ,
                    dummySetting = self.unattach( self.location_type , self.url_vars , self.url_splitters ) ,
                    dummySettingParsed ,
                    layoutSelected ;

                if ( dummySetting ) {

                    layoutSelected = dummySetting.layout[ 0 ] ;
                    if ( cache_controller.active ) {

                        cache_controller.check() ;
                        cache_controller.check( layoutSelected , self.parseToSystem( dummySetting ) ) ;
                    } else {

                        config[ layoutSelected ].consumerId = dummySetting.consumer ;
                        config[ layoutSelected ].providerId = dummySetting.provider ;
                    }
                } else {

                    cache_controller.check() ;
                }

                return true ;
            } ,

            update: function ( setting , location_type ) {

                if ( !this.active ) return false ;

                var self = this ,
                    urlParsed = self.parseToUrl( setting ) ;

                if ( !location_type ) location_type = self.location_type ;

                urlParsed && ( window.location[ location_type ] = urlParsed ) ;
            } ,

            /**
            * Transforma um objeto em uma string e substitui/adiciona ao hash/search do location.
            *
            * @method attach
            * @param {Object} values objeto para ser transformado em hash/search, ex: {"foo":["foo","foofoo"],"bar":["foo2"],"vazio":[""]}
            * @param {String} location_type hash ou search
            * @param {Array} url_vars lista das propriedades do {values} que ser�o usados, qualquer propriedade que n�o esteja nessa lista n�o participa
            * @param {Array} url_splitters lista os separadores, de valores, de propriedade->valor e entre propriedades, ex: [ ',' , '=' , '&' ]
            * @param {Boolean} add se true adiciona no fim do hash/search, sen�o substitu�, default false
            * @return {Boolean} Retorna true se chegou ao fim
            */
            attach: function ( values , location_type , url_vars , url_splitters , add ) {

                var location = window.location[ location_type ] ,
                    propertie ,
                    i ,
                    i_max ,
                    j ,
                    j_max ,
                    parsed = '' ;

                if ( add === true ) parsed = location === '' ? '' : url_splitters[ 2 ] ;
                
                for ( i = 0 , i_max = url_vars.length ; i < i_max ; i++ ){

                    propertie = values[ url_vars[ i ] ] ;
                    parsed += url_vars[ i ] + url_splitters[ 1 ] ;

                    if ( propertie && propertie.length ) {

                        for ( j = 0 , j_max = propertie.length ; j < j_max ; j++ ) {
                    
                            parsed += encodeURIComponent( propertie[ j ] ) ;
                            if ( j > 0 && j < j_max - 1 ) parsed += url_splitters[ 0 ] ;
                        }
                    }

                    if ( i < i_max - 1 ) parsed += url_splitters[ 2 ] ;
                }

                window.location[ location_type ] = add ? location + parsed : parsed ;

                return true ;
            } ,

            /**
            * Transforma um hash/search em um objeto.
            *
            * @method attach
            * @param {String} location_type hash ou search
            * @param {Array} url_vars lista das propriedades do {values} que ser�o usados, qualquer propriedade que n�o esteja nessa lista n�o participa
            * @param {Array} url_splitters lista os separadores, de valores, de propriedade->valor e entre propriedades, ex: [ ',' , '=' , '&' ]
            * @return {Object} Retorna o objeto, ex: {"foo":["foo","foofoo"],"bar":["foo2"],"vazio":[""]}
            */
            unattach: function ( location_type , url_vars , url_splitters ) {

                var location = window.location[ location_type ] ,
                    paramSplited ,
                    dummyReturn = {} ,
                    paramKey ,
                    i ,
                    i_max ,
                    j ;

                if ( ! location ) return false ;

                location = location.slice( 1 ).split( url_splitters[ 2 ] ) ;
                for ( i = 0 , i_max = location.length ; i < i_max ; i++ ){

                    paramSplited = location[ i ].split( url_splitters[ 1 ] ) ;
                    paramKey = paramSplited[ 0 ] ;
                    for ( j = url_vars.length - 1 ; j >= 0 ; j-- ) {

                        if ( url_vars[ j ] === paramKey ) {

                            dummyReturn[ paramKey ] = paramSplited[ 1 ].split( url_splitters[ 0 ] ) ;
                        }
                    }
                }

                return dummyReturn ;
            }
        } ,

        /**
        * Controla reload automatico de provedores
        *
        * @class loadController
        * @constructor none
        */
        // FIXEME:2012-09-12:thiago.morelli:N�o sofreu manuten��o a partir da vers�o 0.1
        loadController: {
        
            father_obj: null ,
            
            providers: [] ,
            
            setting: [] , 
            
            loadCounter: function () {
                // caracas, isso precisa de muita melhoria
                var self = this ,
                    layoutProducts = folha[ self.father_obj].layouts[ folha[ self.father_obj ].content ].providerId ,
                    count = layoutProducts.length ;
               
                /*for ( i = layoutProducts.length - 1 ; i >= 0 ; i-- ) {
                    
                    productDependencies = folha[ self.father_obj].dependencyController.check( layoutProducts[ i ] ) ;
                    if ( productDependencies ) {
                        count += productDependencies.length ;
                    }
                }*/
                
                return count ;
            } ,
            
            reset: function () {
                
                var self = this ,
                    setting = self.setting ,
                    kill = self.intervalController.kill ,
                    settingSelected ;
                
                for ( i = setting.length - 1 ; i >= 0 ; i-- ) {
                    
                    settingSelected = setting[ i ] ;

                    if ( settingSelected.reloadSpeed ) {
                        
                        kill( settingSelected.reload ) ;
                    }
                }
                
                setting.length = 0 ;
                    
                return true ;
            } ,
            
            set: function ( father_obj ) {
                
                var self = this ;
                
                self.father_obj = father_obj ;
                self.intervalController.father_obj = father_obj ;
                self.providers = folha[ father_obj ].config.providersDependencies ;
            } ,
            
            update: function ( consumer , product ) {
                
                var self = this ,
                    reload = false ,
                    reloadSpeed = 0 ,
                    index ,
                    providers = self.providers ,
                    providerSelected ,
                    setting = self.setting ,
                    settingSelected ,
                    settingLength = setting.length ,
                    father_obj = folha[ self.father_obj ] ,
                    i ;
                
                for ( i = providers.length - 1 ; i >= 0 ; i-- ) {
                    
                    providerSelected = providers[ i ] ;

                    if ( providerSelected.provider == product ) {
                        
                        if ( providerSelected.reload ) {
                            
                            reload = providerSelected.reload ;
                            reloadSpeed = providerSelected.reloadSpeed ;
                        }
                        
                        break ;
                    }
                }
                
                for ( i = settingLength - 1 ; i >= 0 ; i-- ) {
                    
                    if ( setting[ i ].consumer == consumer ) {
                        
                        index = i ;
                        
                        break ;
                    }
                }
                
                if ( index !== undefined ) {

                    settingSelected = setting[ index ] ;
                    
                    if ( settingSelected.product != product ) { //console.log('shouldkill?',self.setting[ index ].reload);
                        
                        if ( settingSelected.reload !== false && settingSelected.reload !== true ) {

                            self.intervalController.kill( settingSelected.reload ) ;
                        }
                        settingSelected.product = product ;
                        settingSelected.reload = reload ;
                        settingSelected.reloadSpeed = reloadSpeed ;
                    }
                } else {
                    
                    settingSelected = setting[ settingLength ] = {} ;
                    settingSelected.consumer = consumer ;
                    settingSelected.product = product ;
                    settingSelected.reload = reload ;
                    settingSelected.reloadSpeed = reloadSpeed ;
                }
                
                if ( setting.length >= self.loadCounter() ) {
                    
                    father_obj.cacheController.update() ;
                    father_obj.url_controller.update( setting ) ;
                }

                return true ;
            } , 
            
            check: function ( product , consumer ) {
                
                var self = this ,
                    setting = self.setting ,
                    settingSelected ,
                    i ;
                
                for ( i = setting.length - 1 ; i >= 0 ; i-- ) {
                    
                    settingSelected = setting[ i ] ;

                    if ( settingSelected.consumer == consumer ) {
                        
                        if ( settingSelected.reload !== false ) {
                            
                            settingSelected.reload = self.intervalController.make( i ) ;
                            
                            break ;
                        }
                    }
                }
            } ,
            
            intervalController: {
                
                father_obj: null ,
                
                make: function ( indexConsumer ) {
                    
                    var self = this ,
                        father_obj = self.father_obj ,
                        loadController = folha[ self.father_obj ].loadController ,
                        target ,
                        timeoutId ;
                    
                    target = loadController.setting[ indexConsumer ] ;
                    
                    timeoutId = setTimeout( function () { 
                        
                        var index = indexConsumer ;
                            
                        loadController.intervalController.repeater( index , father_obj ) ;
                    } , target.reloadSpeed ) ;//console.log('make',indexConsumer,'timeoutId',timeoutId);
                    
                    return timeoutId ;
                } ,
                
                repeater: function ( indexConsumer , father_obj ) {
                    
                    var target ,
                        folhaObj = folha[ father_obj ] ,
                        loadController = folha[ father_obj ].loadController ;
                    
                    target = loadController.setting[ indexConsumer ] ;//console.log('repeater',target.consumer,target.product,indexConsumer,father_obj);
                    
                    if ( !folha.animating ) {var a = new Date();//console.log('ok',a);
                        
                        folhaObj.consumers[ target.consumer ].load( target.product ) ;
                    } else {
                        
                        setTimeout( function () {var a = new Date();//console.log('not ok',a);
                        
                            var index = indexConsumer ;
                            
                            loadController.intervalController.repeater( index , father_obj ) ;
                        } , 500 ) ;
                    }
                } ,
                
                kill: function ( victimId ) {//console.log('die bitch',victimId);
                    
                    clearTimeout( victimId ) ;
                    
                    return true
                }
            }
        } ,
        
        /**
        * 
        *
        * @class fake_thread_controller
        * @constructor none
        */
        fake_thread_controller: {
            
            mark: null ,
            
            status: false ,
            
            callback: null ,
            
            on: function ( mark , callback ) {
                
                var self = this ;
                
                self.mark = mark.slice() ;//console.log('on',self.mark,'|',callback );
                self.status = true ;
                self.callback = callback ;
            } ,
            
            off: function () {
                
                var self = this ;//console.log('off',self.mark,'|',self.callback,'|',self );
                
                self.mark.length = 0 ;
                self.status = false ;
                self.callback = null ;
            } ,
            
            check: function ( checked ) {//console.log('check',this.mark,'|',checked,'|',this.status,'|',arguments.callee.caller);
                
                var self =  this ,
                            indexChecked = -1 ,
                            callback ,
                            i ;
                    
                if ( !self.mark ) return ;

                for ( i = self.mark.length - 1 ; i >= 0 ; i--) {
                    
                    if ( self.mark[ i ] === checked ) {
                        
                        indexChecked = i ;
                        
                        break ;
                    }
                }
                
                if ( self.status ) {
                    
                    if ( indexChecked !== -1 ) {
                        
                        self.mark.splice( indexChecked , 1 );
                    } else {
                        
                        return false ;
                    }
                    
                    if ( ! self.mark.length ) {//console.log('indo para off:',this.mark,'|',checked,'|',this.status,'|',arguments.callee.caller);
                        
                        callback = self.callback ;
                        self.off() ;
                        callback() ;
                    }
                    
                    return true ;
                }
                
                return false ;
            }
        } ,
        
        // manuseia eventos genericos
        listener: {

            attach: function ( context , force ) {

                if ( context.events.attached && ! force ) return ;
                        
                var target = context.events.target ,
                    event_type = context.events.type ,
                    event_type_selected ,
                    event_selector = context.events.selector ,
                    event_selector_attr ,
                    event_selector_selected ,
                    splitter = context.events.splitter ,
                    $target ,
                    request ,
                    values ,
                    splitter_index ,
                    splitter_selected ,
                    request_splited ,
                    i ,
                    i_max ,
                    j ,
                    scope ;
                
                if ( target && target.length ) {

                    for ( i = 0 , i_max = target.length ; i < i_max ; i++ ) {

                        $target = $( target[ i ] ) ;
                        event_selector_attr = context.events.selector_attr[ i ] ;
                        splitter_index = splitter[ i ] ;//var a = new Date();console.log('attach',$target,event_selector[ i ] , event_type[ i ],a.getTime());
                        event_type_selected = event_type[ i ] ;
                        event_selector_selected = event_selector[ i ] ;

                        scope = ( function ( splitter_index , event_type_selected , event_selector_selected , event_selector_attr ) {

                            $target.on( event_type_selected , event_selector_selected , function ( e ) {

                                e.preventDefault() ;
                                request = this[ event_selector_attr ] ;
                                if ( typeof request !== 'undefined' ) {
                                    
                                    values = [] ;
                                    for ( j = splitter_index.length - 1 ; j >= 0 ; j-- ) {
                                        
                                        splitter_selected = splitter_index[ j ] ;
                                        if ( typeof splitter_selected === 'string' ) {
                                        
                                            request_splited = request.split( splitter_selected ) ;
                                            if ( typeof request_splited[ 1 ] !== 'undefined' ) {

                                                values[ j ] = request_splited[ 1 ] ;
                                                request = request_splited[ 0 ] ;
                                            } else {
                                                
                                                continue ;
                                            }
                                        } else {
                                            
                                            if ( typeof splitter_selected !== 'undefined' ) {

                                                values[ values.length ] = request ;
                                            } else {

                                                continue ;
                                            }
                                        }
                                    }
                                    
                                    context.event_handler( values ) ;
                                }
                            } ) ;
                        } ) ;
                        scope( splitter_index , event_type_selected , event_selector_selected , event_selector_attr ) ;
                    }

                    context.events.attached = true ;

                    return true ;
                }
            } ,

            unattach: function ( context , index ) {

                var this_self = context || this ,
                    target = this_self.events.target[ index ] ,
                    event_type = this_self.events.type[ index ] ,
                    event_selector = this_self.events.selector[ index ] ,
                    $target ;

                if ( !target ) return false ;
                $target = $( target ) ;

                if ( index !== undefined ) {//var a = new Date();console.log('unattach',target,a.getTime());

                    $target.off( event_type , event_selector ) ;
                } else {

                    //fazer
                }

                this_self.events.attached = false ;

                return true ;
            }
        } ,

        adapter: function ( target , args , context ) {
                        
            var typeof_target = typeof target ,
                target_return ;
            
            if ( target ) {
                
                if ( typeof_target === 'function' ) {
                    
                    target_return = target( args , context ) ;
                } else if ( typeof_target === 'object' ) {
                    
                    target_return = target.init( args , context ) ;
                } else {
                    
                    target_return = target ;
                }
            } else {
                
                return false ;
            }
            
            return target_return ;
        } ,

        before_write: function ( context , before_call ) {

            before_call && before_call() ;

            return true ;
        } ,

        post_write: function ( context , callback ) {

            var css_inherit = context.css.inherit ,
                product ,
                i ;

            if ( css_inherit && css_inherit.length ) {
                
                for ( i = css_inherit.length - 1 ; i >= 0 ; i-- ) {

                    $( context.css.self_current , context.css.container_current ).children().addClass( css_inherit[ i ] ) ;
                }
            }

            product = context.products[ context.active_product ] ;
            if ( product.events && product.events.target && product.events.target.length ) this.listener.attach( product ) ;

            callback && callback() ;

            product.transition.current_type && folha[ context.father_obj ].transition[ product.transition.current_type ].finish( context ) ;

            return true ;
        } ,

        write: function ( context , content , before_call , callback ) {
            
            this.before_write( context , before_call ) ;//console.log(context.container_obj , context.css.self_current , context.css.container_current);

            ( content !== false ) && $( context.css.self_current , context.css.container_current ).html( content ) ;
            
            this.post_write( context , callback ) ;

            return true ;
        } ,

        /*callback_adapter: function ( callback , args ) {

            var callback_selected ,
                callback_function ,
                callback_context ,
                callback_type_call ,
                i ,
                i_max ;

            for ( i = 0 , i_max = callback.length ; i < i_max ; i++ ) {

                callback_selected = callback[ i ] ;
                callback_function = callback_selected[ 0 ] ;
                callback_context = callback_selected[ 1 ] ;
                callback_type_call = callback_selected[ 2 ] ;

                if ( callback_type_call ) {

                    callback_function.call( callback_context , args[ i ] ) ;
                } else {

                    callback_function.apply( callback_context , args[ i ] ) ;
                }
            }
        } ,*/

        transition: {

            plane_no_effect: {

                begin: function ( consumer , first_load ) {

                    consumer.css.self_current = consumer.css.self ;

                    if ( consumer.container_obj ) consumer.css.container_current = folha[ consumer.father_obj ].consumers[ consumer.container_obj ].css.self_current ;

                    consumer.products[ consumer.active_product ].fake_thread_controller.check( 'transition' ) ;

                    return true ;
                } ,

                finish: function ( consumer ) {

                    return true ;
                }
            } ,

            plane_fade_in: {

                begin: function ( consumer , first_load ) {

                    var $consumer ;

                    consumer.css.self_current = consumer.css.self ;

                    if ( consumer.container_obj ) consumer.css.container_current = folha[ consumer.father_obj ].consumers[ consumer.container_obj ].self_current ;

                    consumer.products[ consumer.active_product ].fake_thread_controller.check( 'transition' ) ;

                    return true ;
                } ,

                finish: function ( consumer ) {

                    var $consumer ;

                    folha.animating = true ;
                    $consumer = $( consumer.css.self_current , consumer.css.container_current ) ;
                    if ( $consumer.length ) {

                        $consumer.css( { 'opacity' : '0' } ) ;
                        $consumer.animate( 
                            { 'opacity' : '1' } , 
                            consumer.products[ consumer.active_product ].transition.speed , 
                            function () {
                                folha.animating = false ;
                            } 
                        ) ;
                    }

                    return true ;
                }
            } ,

            plane_fade_in_program: {

                begin: function ( consumer , first_load ) {

                    var $consumer ;

                    consumer.css.self_current = consumer.css.self ;

                    if ( consumer.container_obj ) consumer.css.container_current = folha[ consumer.father_obj ].consumers[ consumer.container_obj ].self_current ;

                    $consumer = $( consumer.css.self_current , consumer.css.container_current ) ;
                    $consumer.length && $consumer.css( { 'opacity' : '0' } ) ;
                    consumer.products[ consumer.active_product ].fake_thread_controller.check( 'transition' ) ;

                    return true ;
                } ,

                finish: function ( consumer ) {

                    var $consumer ;

                    folha.animating = true ;
                    $consumer = $( consumer.css.self_current , consumer.css.container_current ) ;
                    $consumer.length && $consumer.animate( 
                        { 'opacity' : '1' , 'width' : '135px' } , 
                        consumer.products[ consumer.active_product ].transition.speed , 
                        function () {
                            folha.animating = false ;
                        } 
                    ) ;

                    return true ;
                }
            } ,

            plane_fade_out_in: {

                begin: function ( consumer , first_load , speed ) {

                    var $consumer ;

                    consumer.css.self_current = consumer.css.self ;

                    if ( consumer.container_obj ) consumer.css.container_current = folha[ consumer.father_obj ].consumers[ consumer.container_obj ].self_current ;

                    folha.animating = true ;//console.log('trans-plane-fade',consumer.css.self_current,'|',consumer.css.container_current);
                    $consumer = $( consumer.css.self_current , consumer.css.container_current ) ;
                    $consumer.length && $consumer.animate( 
                        { 'opacity' : '0' } , 
                        speed || consumer.products[ consumer.active_product ].transition.speed , 
                        function () {
                            folha.animating = false ;
                            consumer.products[ consumer.active_product ].fake_thread_controller.check( 'transition' ) ;
                        } 
                    ) ;

                    return true ;
                } ,

                finish: function ( consumer ) {

                    var this_self = this ,
                        $consumer ;

                    if ( !folha.animating ) {
                        
                        folha.animating = true ;
                        $consumer = $( consumer.css.self_current , consumer.css.container_current ) ;
                        $consumer.length && $consumer.animate( 
                            { 'opacity' : '1' } , 
                            consumer.products[ consumer.active_product ].transition.speed , 
                            function () {//console.log('finish');
                                folha.animating = false ;
                            } 
                        ) ;
                        
                        return true ;
                    } else {
                        
                        timeoutId = setTimeout( function () {
                            
                            this_self.finish( consumer ) ;
                        } , consumer.products[ consumer.active_product ].transition.speed / 5 ) ;
                    }
                }
            } ,

            plane_smash: {

                begin: function ( consumer , first_load ) {

                    var $consumer ;

                    consumer.css.self_current = consumer.css.self ;

                    if ( consumer.container_obj ) consumer.css.container_current = folha[ consumer.father_obj ].consumers[ consumer.container_obj ].self_current ;

                    folha.animating = true ;//console.log('trans-plane-fade',consumer.css.self_current,'|',consumer.css.container_current);
                    $consumer = $( consumer.css.self_current , consumer.css.container_current ) ;
                    $consumer.length && $consumer.animate( 
                        { 'width' : '0' , 'opacity' : '0' } , 
                        consumer.products[ consumer.active_product ].transition.speed , 
                        function () {
                            folha.animating = false ;
                            consumer.products[ consumer.active_product ].fake_thread_controller.check( 'transition' ) ;
                        } 
                    ) ;

                    return true ;
                } ,

                finish: function ( consumer ) {

                    return true ;
                }
            } ,
        
            noEffect: {
                
                begin:  function ( css_subject , css_container , css_imaginary , css_real , css_loading , context  ) {
                    
                    var self = this ,
                        $subjectImaginary = $( css_subject + css_imaginary , css_container ) ,
                        $subjectReal = $( css_subject + css_real , css_container ) ;//console.log('noEffect|','begin|',css_subject , css_container);
                    
                    $subjectImaginary.css( { 'opacity' : '1' } ) ;
                    $subjectReal.css( { 'opacity' : '0' } ) ;
                    
                    return true ;
                } ,
                    
                finish: function ( css_subject , css_container , css_imaginary , css_real , css_loading , context ) {
                    
                    var self = this ,
                        $subjectImaginary = $( css_subject + css_imaginary , css_container ) ,
                        $subjectReal = $( css_subject + css_real , css_container ) ,
                        css_real_class = css_real.slice(1) ,
                        css_imaginary_class = css_imaginary.slice(1) ,
                        css_loading_class = css_loading.slice(1) ;//console.log('noEffect|','finish|',css_subject , css_container);
                    
                    $subjectReal.addClass( css_imaginary_class + ' ' + css_loading_class ).removeClass( css_real_class ) ;
                    $subjectImaginary.removeClass( css_imaginary_class + ' ' + css_loading_class ).addClass( css_real_class ) ;
                    
                    return true ;
                }
            } ,
            
            fadeToggle:  {
                
                begin:  function ( css_subject , css_container , css_imaginary , css_real , css_loading , speed , context ) {
                
                    var self = this ,
                        $subjectImaginary = $( css_subject + css_imaginary , css_container ) ,
                        $subjectReal = $( css_subject + css_real , css_container ) ;//console.log('fadeToggle|','begin|',css_subject , css_container);
                        
                    if ( !folha.animating ) {
                        folha.animating = true ;
                        
                        $subjectImaginary.css( { 'opacity' : '1' } ) ;
                        $subjectReal.animate( { 'opacity' : '0' } , speed , function () {
                            
                            folha.animating = false ;
                        } ) ;
                        
                        return true ;
                    } else {
                        
                        return false ;
                    }
                } ,
                
                finish: function ( css_subject , css_container , css_imaginary , css_real , css_loading , speed , context ) {
                    
                    var self = this ,
                        $subjectImaginary = $( css_subject + css_imaginary , css_container ) ,
                        $subjectReal = $( css_subject + css_real , css_container ) ,
                        css_real_class = css_real.slice(1) ,
                        css_imaginary_class = css_imaginary.slice(1) ,
                        css_loading_class = css_loading.slice(1) ;//console.log('fadeToggle|','finish|',css_subject , css_container);
                        
                    if ( !folha.animating ) {
                        
                        $subjectReal.addClass( css_imaginary_class + ' ' + css_loading_class ).removeClass( css_real_class ) ;
                        $subjectImaginary.removeClass( css_imaginary_class + ' ' + css_loading_class ).addClass( css_real_class ) ;
                    } else if ( folha.animating ) {
                        
                        timeoutId = setTimeout( function () {
                            
                            self.finish( css_subject , css_container , css_imaginary , css_real , css_loading , speed ) ;
                        } , speed / 5 ) ;
                    }
                }
            }
        }
    }
} ;

if ( !Array.indexOf ) {
    Array.prototype.indexOf = function ( obj , start ) {
        for ( var i = ( start || 0 ) , max = this.length ; i < max ; i++ ) {
            if ( this[ i ] == obj ) {
                return i ;
            }
        }
        return -1 ;
    }
}

// heran�a simples
function inherit ( p ) {

    if ( p == null ) return p ;

    if ( Object.create ) return Object.create( p ) ;

    var t = typeof p ;

    if ( t !== "object" && t !== "function" ) throw TypeError() ;

    function f() {} ;

    f.prototype = p ;

    return new f() ;
}

// slow, use with care
function inheritDeep ( fatherObj ) {
    if ( fatherObj == null ) return fatherObj ;

    var inheritLogic = [] ,
        inheritLogicNames = [] ,
        inheritIndexDependencies ,
        property ,
        i ,
        maxj ,
        j ;

    inheritLogic[ 0 ] = $.extend( true , {} , fatherObj ) ;
    inheritLogicNames[ 0 ] = 'fatherObj' ;

    for ( i = 0 ; i < inheritLogic.length ; i++ ) {

        if ( i > 0 && $.isArray( inheritLogic[ i ] ) ) {//console.log(i,inheritLogicNames,typeof inheritLogic[ i ]);

            for ( j = 0 , maxj = inheritLogic[ i ].length ; j < maxj ; j++ ) {

                inheritLogic[ inheritLogic.length ] = inheritLogic[ i ][ j ] ;
                inheritLogicNames[ inheritLogicNames.length ] = inheritLogicNames[ i ][ j ] ;
                inheritIndexDependencies = inheritLogic.length ;

                for ( property in inheritLogic[ i ][ j ] ) {

                    if ( inheritLogic[ i ][ j ][ property ] && typeof inheritLogic[ i ][ j ][ property ] === 'object' && !$.isArray( inheritLogic[ i ][ j ][ property ] ) ) {

                        if ( inheritLogic[ inheritIndexDependencies ] ) {

                            inheritLogic[ inheritIndexDependencies ][ inheritLogic[ inheritIndexDependencies ].length ] = inheritLogic[ i ][ j ][ property ] ;
                            inheritLogicNames[ inheritIndexDependencies ][ inheritLogicNames[ inheritIndexDependencies ].length ] = property ;
                        } else {

                            inheritLogic[ inheritIndexDependencies ] = [] ;
                            inheritLogicNames[ inheritIndexDependencies ] = [] ;
                            inheritLogic[ inheritIndexDependencies ][ inheritLogic[ inheritIndexDependencies ].length ] = inheritLogic[ i ][ j ][ property ] ;
                            inheritLogicNames[ inheritIndexDependencies ][ inheritLogicNames[ inheritIndexDependencies ].length ] = property ;
                        }
                    } 
                }
            }
        } else if ( i === 0 ) {

            for ( property in inheritLogic[ i ] ) {

                if ( inheritLogic[ i ].hasOwnProperty( property ) && inheritLogic[ i ][ property ] && typeof inheritLogic[ i ][ property ] === 'object' && !$.isArray( inheritLogic[ i ][ property ] ) ) {

                    if ( inheritLogic[ i + 1 ] ) {

                        inheritLogic[ i + 1 ][ inheritLogic[ i + 1 ].length ] = inheritLogic[ i ][ property ] ;
                        inheritLogicNames[ i + 1 ][ inheritLogicNames[ i + 1 ].length ] = property ;
                    } else {

                        inheritLogic[ i + 1 ] = [] ;
                        inheritLogicNames[ i + 1 ] = [] ;
                        inheritLogic[ i + 1 ][ inheritLogic[ i + 1 ].length ] = inheritLogic[ i ][ property ] ;
                        inheritLogicNames[ i + 1 ][ inheritLogicNames[ i + 1 ].length ] = property ;
                    }
                } 
            }
        }
    }//console.log(inheritLogicNames,fatherObj);

    for ( i = inheritLogic.length - 1 ; i >= 0 ; i-- ) {
        
        if ( i > 0 && $.isArray( inheritLogic[ i ] ) ) {

            for ( j = inheritLogic[ i ].length - 1 ; j >= 0 ; j-- ) {//console.log(inheritLogic.length,'|',i,'|', j,'|' ,inheritLogic[ i - 1 ],'|',inheritLogicNames[ i ][ j ]);

                inheritLogic[ i - 1 ][ inheritLogicNames[ i ][ j ] ] = inherit( inheritLogic[ i ][ j ] ) ;
            }
        } else if ( i == 0 ) {

            return inheritLogic[ i ] ;
        }
    }
}