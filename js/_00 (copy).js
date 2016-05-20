var $lev={};
(function(){
var _i=false;
var $={
ini:function(){
	$xml._orig=true;
	_i=_.uv.i;
	window.document.title='demo::'+_i;
	window.$=this;
	_.page();
	_.ini();
	if(_i in $){
		$[_i].ini(no.con)
	}
}};
this.$_dmo=$;
})();


(function(){
var _drop,_dni,$=$_dmo,_f,_js={},_rv,_cv,_pdf;
$.f={
f:[],
tools:{
	consult:function(val){
		return 'foo!'+val
	},
	recode:function(col,val,typ){
		var me=this,d;
		if(col in _rv){
			val=(val!=null)?_rv[col][val.toLowerCase()]:null;
		}else if(col in me){
			val=me[col](val)
		}
		if(typ=="date" && val!=""){	//Excel Nu to mysql date
			d=new Date((val - (25567 + 1))*86400*1000);
			val=d.getFullYear()+"-"+(d.getMonth()+1).zpad(2)+"-"+d.getDate().zpad(2);
		}		
		return val;
	}
},
data:{
	insert:function(r){
		var q,u,ii,v,c,tbl='',ot=[],mrg=[],vl,oh=[],oj=[],s,sp,spa,spb,ra=[],spr,vlu;
		_rv={};
		_cv=false;
		if(r.RECODE){
			v=r.RECODE;
			for(var i=0,l=v.length;i<l;i++){
				u=v[i];
				if(!_rv[u.col]){_rv[u.col]={}}
				_rv[u.col][u.val.toLowerCase()]=u.recode
			}
			delete(r.RECODE)
		}
		var ctyp={};
		if(r.COLS){
			_cv={};
			v=r.COLS;
			var t=v[0].tbl;

			tbl='DROP TABLE IF EXISTS '+t+';\n';
			tbl+='CREATE TABLE '+t+'(\n';
			tbl+='id int unsigned  NOT NULL AUTO_INCREMENT,\n';
			for(var i=0,l=v.length;i<l;i++){
				c=_cv[v[i].orig]=v[i].col||v[i].orig;
				ctyp[c]=v[i].typ;
				ot[c]=v[i].oth;
				oj=ot[c].split("_");
				if(oj[0]!='a' && oj[0]!='d' && oj[0]!='s' ){
					tbl+=c+' '+(v[i].typ||'varchar(255)')+',\n';
				}
				if(oj[0]=='s' || oj[0]=='sp'){
					for(var j=0;j<oj[1];j++){
						tbl+=c+'_'+(j*1+1)+' '+(v[i].typ||'varchar(255)')+',\n';
					}
				}
			}
			tbl+='PRIMARY KEY (id)\n';
			tbl+=') ENGINE=InnoDB;\n';
			delete(r.COLS)
		}
		for(var t in r){
			u=r[t][0];q='';		
			for(var c in u){
				if(_cv){c=_cv[c]||c}
				if(ot[c]!=undefined){oh=ot[c].split("_");}
				if(oh[0]!="a" && oh[0]!='d'){	
					if(c!='undefined'){
						if(oh[0]=='s' || oh[0]=='sp' ){
							for(var j=0;j<oh[1];j++){q+=(q?',':'')+c+"_"+(j*1+1);}
						}else{
							q+=(q?',':'')+c;
						}
					}
				}

			}
			q='DELETE FROM '+t+' WHERE id>0;ALTER TABLE '+t+' auto_increment=1;\nINSERT INTO '+t+'('+q+')';
			ii=-1;
			nr=false; var prc=[],o=[];
			_.loop(r[t],function(val,i,col){
				if(val){val=val.trim().replace(/'/gi,"\\'")}
				if(_cv){col=_cv[col]||col}
				if(i!=ii){q+=(i>0?'),':'\nVALUES')+'\n(';ii++;nr=true}			
				if(ot[col]!=undefined){o=ot[col].split("_")}else{o[0]="";}
				if(o[0]=="d"){
					//
				}else if(o[0]=="a"){
					if(o[2]==0){mrg[o[1]]=[];}
					vl=$.f.tools.recode(col,val,ctyp[col]);
					if(vl!="" && vl!=undefined){mrg[o[1]].push(vl);}
				}else if(o[0]=="m"){
					val=(val!="" && val!=undefined)? ","+$.f.tools.recode(col,val,ctyp[col]):"";
					vlu=mrg[o[1]].join(",")+val;		
					q+=(nr?'':',')+(vlu=='' || vlu==undefined ?null:"'"+vlu+"'");
					nr=false
				}else if(o[0]=="s"){
					for(var k=0;k<o[1];k++){
						s=(val!="" && val!=undefined)?val:null;
						s=$.f.tools.recode(col+"_"+(k*1+1),s,ctyp[col]);
						if(o[2]=='b' && s==undefined ){s='0';}
						//alert(s+"---"+col+"_"+(k*1+1))
						q+=(nr?'':',')+(s=='' || s==undefined ?null:"'"+s+"'");
						nr=false
					}
				}else if(o[0]=="sp"){
					spr=(o[2]=='lb')?String.fromCharCode(10):o[2];
					sp=val.split(spr);
					for(var k=0;k<o[1];k++){
						spb=0
						for(var m=0;m<sp.length;m++){								
							spa=(sp[m]!="" && sp[m]!=undefined)?sp[m]:null;
							spa=$.f.tools.recode(col+"_"+(k*1+1),spa,ctyp[col]);
							if(o[3]=='b' && (spa==undefined ||spa=='null' )){spa='0';}
							spb=spa*1+spb*1;
						}
						spb="'"+spb+"'"
						q+=(nr?'':',')+(spb=='' || spb==undefined ?null:spb);
						nr=false
					}
				}else if(o[0]=="r"){
						ra=(val.split(o[1]));
						for(var l in ra){
							ra[l]=$.f.tools.recode(col,ra[l],ctyp[col]);
						}
						val=ra.join();
						
						q+=(nr?'':',')+(val=='' || val==undefined ?null:"'"+val+"'");
						nr=false
				}else if(o[0]=="b"){
						val=$.f.tools.recode(col,val,ctyp[col]);
						if(val==undefined || val=="" || val=="null" ){val='0';}	
						q+=(nr?'':',')+(val=='' || val==null? null:"'"+val+"'");
						nr=false
				}else{
					if(col!='undefined'){				
						val=$.f.tools.recode(col,val,ctyp[col]);
						val=(val!="" && val!=undefined)?val:null;
						q+=(nr?'':',')+(val=='' || val==null? null:"'"+val+"'");
						nr=false
					}
				}
			})
		}
		_.txa(tbl+'\n'+q+');;')
	}
},
ini:function(o){
	vv.pdf_rip=1;
	_drop=no.div(0,document.body,'drop questionnaire',{_s:'abs,t.20,l.20,p.12,w.150,cen,o.aaa,r.15,b.000,opa.85,z.1'});
	_.drop.set(_drop,this.define);
	_dbi=no.div(0,document.body,'data insert',{_s:'abs,t.80,l.20,p.12,w.150,cen,o.aaa,r.15,b.000,opa.85,z.1'});
	_.drop.set(_dbi,this.data.insert);
	_pdf=no.div(0,document.body,'zip text',{_s:'abs,non,t.140,l.20,p.12,w.150,cen,o.aaa,r.15,b.000,opa.85,z.1'});
	_.drop.set(_pdf,this.zip.arc)
	//var v=$xml.ods.frm.sheet($_forms.ecg);
	//no.div(document.body,{id:'message'},'message');
	//no.div(document.body,{id:'viewer'},'viewer')
	return
	_drop.display(0);
	no.div(no.con,json(v));
	jax({f:'ifo/ecg',s:$ods.sheet({ecg:v})},function ods_write(r){alert(r)})
},

zip:{
	arc:function arkiv(dat){
		alert(dat)
	}
},
define:function(r){
	_dbi.display(0);
	var me=$.f;
	me.f=[];
	for(var f in r){
		if(f!='lev' && f.substr(0,1)!='_'){
			me.f.push(f);
			$f[f]={c:$xml.ods.frm.cc(r[f],r.lev||false)}
			_js[f]=jclone($f[f]);
		}
	}
	me.sho();
},
format:function(f){
	var lev='',u={};
	_.loop(_js[f].c,function(v,i,j){
		if(v.lev){
			if(!(v.lev_ix in u)){
				lev+="\n$lev['"+v.lev_ix+"']="+json($f[f].c[i][j].lev).keyclean()+';';
				u[v.lev_ix]=1;
			}
			v.lev=v.lev_ix;delete(v.lev_ix);
		}
	});
	//jalert(u)
	var s=json(_js[f]).keyclean();
	s=s.replace(/\},\{/g,"},\n{");
	s=s.replace(/\],\[/g,"\n],[\n");
	s=s.replace(/c:\[\[/g,"\nc:[[\n");
	s=s.replace(/\]\],/g,"\n]],\n");
	s=s.replace(/'/g,"\\'");
	s=s.replace(/"/g,"'");
	return '$f.'+f+'='+s+'\n'+lev;
},
sho:function(f){
	if(f=='EXPORT'){
		_.txa($.f.format(_f))
	}else{
		_drop.display(0);
		f=f||this.f[0];
		_f=f;
		if(no.frm){
			no.frm.clear();
			no.til.htm(f.uc())
		}else{
			no.targs=1;
			no.div(
				no.con,{_s:'p.3|0,mb.15,c.fff'},
				no.span('\u2665 ',{_s:'c.c00,f.16'}),no.a({id:'til'},f.uc(),this.swi),
				no.div(1,{id:'frm',_s:'bt.fff,pt.10'})
			);
			no.targs=0;
		}
		$fo.build(f,no.frm);
	}
},
swi:function(o){
	var m=jclone($.f.f);m.push('EXPORT');
	_.fly.pop(o,m,$.f.sho)
}
}})();



$_forms={ecg:{
	c:[[
		{c:'til',l:'date of test',ver:0},
		{c:'dtx',v:'datex',l:'date'},
		{c:'til',l:'heart rate',ver:0},
		{c:'num',v:'HR',l:'heart rate (bpm)',dec:2,min:'20.0000',max:'200.0000'},
		{c:'til',l:'QRS duration',ver:0},
		{c:'num',v:'qrs_duration',l:'duration (msec)',min:'1.0000',max:'200.0000'},
		{c:'til',l:'RBBB',ver:0},
		{c:'rad',v:'rbbb',lev:55},
		{c:'til',l:'rhythm',ver:0},
		{c:'chk',v:'rhythm',l:'rhythm'},
		{c:'til',l:'↘ rhythm type',ver:13,i:[1,4]},
		{c:'rad',v:'rhythm_type',lev:29},
		{c:'txt',v:'rhythm_other',max:50},
		{c:'til',l:'T-wave inversion',ver:0},
		{c:'chk',v:'twave_inversion',l:'inversion'}
	],[
		{c:'til',l:'↘ inversion type(s)',ver:13,i:[1,8]},
		{c:'tri',v:'twave_v1',l:'V<sub>1<\/sub>'},
		{c:'tri',v:'twave_v2',l:'V<sub>2<\/sub>'},
		{c:'tri',v:'twave_v3',l:'V<sub>2<\/sub>'},
		{c:'tri',v:'twave_v4',l:'V<sub>4<\/sub>'},
		{c:'tri',v:'twave_v5',l:'V<sub>5<\/sub>'},
		{c:'tri',v:'twave_v6',l:'V<sub>6<\/sub>'},
		{c:'tri',v:'twave_other',l:'other'},
		{c:'txt',v:'twave_other_desc',max:'250'},
		{c:'til',l:'epsilon wave in V<sub>1<\/sub>-V<sub>3<\/sub>',ver:0},
		{c:'rad',v:'epsilon_wave',lev:23},
		{c:'til',l:'↘ if yes',ver:13,i:[1,3]},
		{c:'tri',v:'ewave_v1',l:'V<sub>1<\/sub>'},
		{c:'tri',v:'ewave_v2',l:'V<sub>2<\/sub>'},
		{c:'tri',v:'ewave_v3',l:'V<sub>3<\/sub>'},
		{c:'til',l:'terminal activation duration of QRS ',ver:0},
		{c:'til',l:'nadir of S wave to end of QRS in V1, V2, or V',ver:2,dot:4,i:[1,1]},
		{c:'num',v:'qrs_ta_duration',l:'terminal activation (msec)',min:'1.0000',max:'200.0000'},
		{c:'til',l:'comments',ver:0},
		{c:'txa',v:'comment'}
	]]
}}

