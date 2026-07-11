<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOutreachRequest;
use App\Http\Requests\UpdateOutreachRequest;
use App\Http\Resources\OutreachResource;
use App\Models\Outreach;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OutreachController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $outreaches = Outreach::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return OutreachResource::collection($outreaches);
    }

    public function store(StoreOutreachRequest $request): JsonResponse
    {
        $outreach = Outreach::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return response()->json(new OutreachResource($outreach), 201);
    }

    public function show(Outreach $outreach): OutreachResource
    {
        $this->authorizeAccess($outreach);
        return new OutreachResource($outreach);
    }

    public function update(UpdateOutreachRequest $request, Outreach $outreach): OutreachResource
    {
        $this->authorizeAccess($outreach);
        $outreach->update($request->validated());
        return new OutreachResource($outreach);
    }

    public function destroy(Outreach $outreach): JsonResponse
    {
        $this->authorizeAccess($outreach);
        $outreach->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    private function authorizeAccess(Outreach $outreach): void
    {
        if ($outreach->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
    }
}
