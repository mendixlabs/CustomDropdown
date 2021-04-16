// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package myfirstmodule.proxies.microflows;

import java.util.HashMap;
import java.util.Map;
import com.mendix.core.Core;
import com.mendix.core.CoreException;
import com.mendix.systemwideinterfaces.MendixRuntimeException;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IMendixObject;

public class Microflows
{
	// These are the microflows for the MyFirstModule module
	public static void createAnimal(IContext context, myfirstmodule.proxies.SelectContext _selectContext)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		Core.microflowCall("MyFirstModule.CreateAnimal").withParams(params).execute(context);
	}
	public static myfirstmodule.proxies.SelectContext dS_CreateSelectContext(IContext context)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		IMendixObject result = (IMendixObject)Core.microflowCall("MyFirstModule.DS_CreateSelectContext").withParams(params).execute(context);
		return result == null ? null : myfirstmodule.proxies.SelectContext.initialize(context, result);
	}
	public static void widget_ClearValue(IContext context, myfirstmodule.proxies.SelectContext _selectContext, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		Core.microflowCall("MyFirstModule.Widget_ClearValue").withParams(params).execute(context);
	}
	public static void widget_CreateValueInPopup(IContext context, myfirstmodule.proxies.SelectContext _selectContext, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		Core.microflowCall("MyFirstModule.Widget_CreateValueInPopup").withParams(params).execute(context);
	}
	public static void widget_CreateValueSimple(IContext context, myfirstmodule.proxies.SelectContext _selectContext, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		Core.microflowCall("MyFirstModule.Widget_CreateValueSimple").withParams(params).execute(context);
	}
	public static java.util.List<myfirstmodule.proxies.Animal> widget_GetAnimalOptions(IContext context, myfirstmodule.proxies.SelectContext _selectContext, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		java.util.List<IMendixObject> objs = Core.microflowCall("MyFirstModule.Widget_GetAnimalOptions").withParams(params).execute(context);
		java.util.List<myfirstmodule.proxies.Animal> result = null;
		if (objs != null)
		{
			result = new java.util.ArrayList<>();
			for (IMendixObject obj : objs)
				result.add(myfirstmodule.proxies.Animal.initialize(context, obj));
		}
		return result;
	}
	public static java.util.List<myfirstmodule.proxies.Animal> widget_GetDefaultValue(IContext context, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		java.util.List<IMendixObject> objs = Core.microflowCall("MyFirstModule.Widget_GetDefaultValue").withParams(params).execute(context);
		java.util.List<myfirstmodule.proxies.Animal> result = null;
		if (objs != null)
		{
			result = new java.util.ArrayList<>();
			for (IMendixObject obj : objs)
				result.add(myfirstmodule.proxies.Animal.initialize(context, obj));
		}
		return result;
	}
	public static void widget_OnSelect(IContext context, myfirstmodule.proxies.SelectContext _selectContext, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		Core.microflowCall("MyFirstModule.Widget_OnSelect").withParams(params).execute(context);
	}
	public static void widget_SelectOption(IContext context, myfirstmodule.proxies.SelectContext _selectContext, myfirstmodule.proxies.AnimalOwner _animalOwner)
	{
		Map<java.lang.String, Object> params = new HashMap<>();
		params.put("SelectContext", _selectContext == null ? null : _selectContext.getMendixObject());
		params.put("AnimalOwner", _animalOwner == null ? null : _animalOwner.getMendixObject());
		Core.microflowCall("MyFirstModule.Widget_SelectOption").withParams(params).execute(context);
	}
}